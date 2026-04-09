package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.dto.BookingRequest;
import com.example.campus_hub_backend.dto.BookingResponse;
import com.example.campus_hub_backend.entity.Booking;
import com.example.campus_hub_backend.entity.Resource;
import com.example.campus_hub_backend.entity.User;
import com.example.campus_hub_backend.enumtype.BookingStatus;
import com.example.campus_hub_backend.enumtype.ResourceCondition;
import com.example.campus_hub_backend.enumtype.ResourceStatus;
import com.example.campus_hub_backend.exception.BadRequestException;
import com.example.campus_hub_backend.exception.BookingConflictException;
import com.example.campus_hub_backend.exception.ResourceNotFoundException;
import com.example.campus_hub_backend.repository.BookingRepository;
import com.example.campus_hub_backend.repository.ResourceRepository;
import com.example.campus_hub_backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.example.campus_hub_backend.enumtype.NotificationType;

@Service
public class BookingService {
    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /** Statuses that block a time slot and should be considered for conflict checks */
    private static final List<BookingStatus> BLOCKING_STATUSES =
            List.of(BookingStatus.PENDING, BookingStatus.APPROVED);

    public BookingService(BookingRepository bookingRepository,
                          ResourceRepository resourceRepository,
                          UserRepository userRepository,
                          NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
          this.notificationService = notificationService;
    }

    // ─── Create Booking ────────────────────────────────────────

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        validateRequestedTimeRange(request.getStartTime(), request.getEndTime());
        validateTodayTimeNotInPast(request.getBookingDate(), request.getStartTime());

        // 1. Validate resource exists and is bookable
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resource not found with id: " + request.getResourceId()));
        validateResourceBookableForSlot(
            resource,
            request.getStartTime(),
            request.getEndTime(),
            request.getExpectedAttendees());

        // 2. Check for scheduling conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                resource.getId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                BLOCKING_STATUSES);

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "Time slot conflicts with an existing booking for this resource");
        }

        // 3. Resolve user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // 4. Build and save
        Booking booking = new Booking();
        booking.setResource(resource);
        booking.setUser(user);
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());

        Booking saved = bookingRepository.save(booking);

        sendBookingNotificationSafely(
                saved,
                NotificationType.BOOKING_CREATED,
                "Booking request submitted",
                "Your booking request for resource \"" + getResourceLabel(saved) + "\" was created.");

        return toResponse(saved);
    }

    // ─── My Bookings ──────────────────────────────────────────

    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        return bookingRepository.findByUserIdOrderByBookingDateDescStartTimeDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ─── All Bookings (Admin) ─────────────────────────────────

    public List<BookingResponse> getAllBookings(BookingStatus status, LocalDate date, Long resourceId) {
        return bookingRepository.findAllWithFilters(status, date, resourceId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ─── Approve ──────────────────────────────────────────────

    @Transactional
    public BookingResponse approveBooking(Long bookingId, String adminEmail) {
        Booking booking = findBookingOrThrow(bookingId);
        Resource resource = booking.getResource();

        if (resource == null) {
            throw new BadRequestException("Booking cannot be approved because resource data is missing");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be approved");
        }

        validateTodayTimeNotInPast(booking.getBookingDate(), booking.getStartTime());
        validateResourceBookableForSlot(
            resource,
            booking.getStartTime(),
            booking.getEndTime(),
            booking.getExpectedAttendees());

        // Re-check for conflicts at approval time (another booking may have been approved since)
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                booking.getResource().getId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                List.of(BookingStatus.APPROVED));

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "Cannot approve — time slot now conflicts with an already approved booking");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setApprovedBy(adminEmail);
        booking.setApprovedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);

        sendBookingNotificationSafely(
                saved,
                NotificationType.BOOKING_APPROVED,
                "Booking approved",
                "Your booking for resource \"" + getResourceLabel(saved) + "\" has been approved.");
        return toResponse(saved);


    }

    // ─── Reject ───────────────────────────────────────────────

    @Transactional
    public BookingResponse rejectBooking(Long bookingId, String reason, String adminEmail) {
        Booking booking = findBookingOrThrow(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);

        Booking saved = bookingRepository.save(booking);

        sendBookingNotificationSafely(
                saved,
                NotificationType.BOOKING_REJECTED,
                "Booking rejected",
                "Your booking for resource \"" + getResourceLabel(saved) + "\" was rejected. Reason: " + reason);
        return toResponse(saved);
    }

    // ─── Cancel ───────────────────────────────────────────────

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String userEmail) {
        Booking booking = findBookingOrThrow(bookingId);

        // Determine if requester is the owner or an admin
        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        boolean isOwner = booking.getUser().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole().name().equals("ADMIN");

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("You can only cancel your own bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING &&
                booking.getStatus() != BookingStatus.APPROVED) {
            throw new BadRequestException("Only PENDING or APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);

        sendBookingNotificationSafely(
                saved,
                NotificationType.BOOKING_CANCELLED,
                "Booking cancelled",
                "Your booking for resource \"" + getResourceLabel(saved) + "\" has been cancelled.");

        return toResponse(saved);

    }

    // ─── Reschedule ───────────────────────────────────────────

    @Transactional
    public BookingResponse rescheduleBooking(Long bookingId, BookingRequest request, String userEmail) {
        Booking booking = findBookingOrThrow(bookingId);

        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        boolean isOwner = booking.getUser().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole().name().equals("ADMIN");

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("You can only reschedule your own bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING &&
                booking.getStatus() != BookingStatus.APPROVED) {
            throw new BadRequestException("Only PENDING or APPROVED bookings can be rescheduled");
        }

        validateRequestedTimeRange(request.getStartTime(), request.getEndTime());
        validateTodayTimeNotInPast(request.getBookingDate(), request.getStartTime());

        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resource not found with id: " + request.getResourceId()));
        validateResourceBookableForSlot(
            resource,
            request.getStartTime(),
            request.getEndTime(),
            request.getExpectedAttendees());

        List<Booking> conflicts = bookingRepository.findConflictingBookingsExcludingId(
                booking.getId(),
                resource.getId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                BLOCKING_STATUSES);

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "Reschedule conflict: selected time slot overlaps an existing booking");
        }

        booking.setResource(resource);
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setApprovedBy(null);
        booking.setApprovedAt(null);
        booking.setRejectionReason(null);

        Booking saved = bookingRepository.save(booking);

        sendBookingNotificationSafely(
                saved,
                NotificationType.BOOKING_UPDATED,
                "Booking rescheduled",
                "Your booking for resource \"" + getResourceLabel(saved) + "\" was rescheduled and is pending approval.");

        return toResponse(saved);
    }

    // ─── Delete ───────────────────────────────────────────────

    @Transactional
    public void deleteBooking(Long bookingId, String userEmail) {
        Booking booking = findBookingOrThrow(bookingId);

        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        boolean isOwner = booking.getUser().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole().name().equals("ADMIN");

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("Only the booking owner or an admin can delete this booking");
        }

        if (booking.getStatus() != BookingStatus.CANCELLED) {
            throw new BadRequestException("Only CANCELLED bookings can be deleted");
        }

        bookingRepository.delete(booking);
    }

    // ─── Helpers ──────────────────────────────────────────────

    private Booking findBookingOrThrow(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    /** Maps entity to response DTO */
    private BookingResponse toResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        Resource resource = booking.getResource();
        User user = booking.getUser();
        response.setId(booking.getId());
        response.setResourceId(resource != null ? resource.getId() : null);
        response.setResourceName(resource != null ? resource.getName() : null);
        response.setUserId(user != null ? user.getId() : null);
        response.setUserName(user != null ? user.getName() : null);
        response.setBookingDate(booking.getBookingDate());
        response.setStartTime(booking.getStartTime());
        response.setEndTime(booking.getEndTime());
        response.setPurpose(booking.getPurpose());
        response.setExpectedAttendees(booking.getExpectedAttendees());
        response.setStatus(booking.getStatus().name());
        response.setRejectionReason(booking.getRejectionReason());
        response.setApprovedBy(booking.getApprovedBy());
        response.setApprovedAt(booking.getApprovedAt());
        response.setCreatedAt(booking.getCreatedAt());
        response.setUpdatedAt(booking.getUpdatedAt());
        return response;
    }

    private void validateRequestedTimeRange(LocalTime startTime, LocalTime endTime) {
        if (!startTime.isBefore(endTime)) {
            throw new BadRequestException("Start time must be before end time");
        }
    }

    private void validateTodayTimeNotInPast(LocalDate bookingDate, LocalTime startTime) {
        if (!LocalDate.now().equals(bookingDate)) {
            return;
        }

        LocalTime now = LocalTime.now();
        if (!startTime.isAfter(now)) {
            throw new BadRequestException("For today, start time must be in the future");
        }
    }

    private void validateResourceBookableForSlot(
            Resource resource,
            LocalTime startTime,
            LocalTime endTime,
            Integer expectedAttendees) {
        if (Boolean.FALSE.equals(resource.getIsActive())) {
            throw new BadRequestException("Resource '" + resource.getName() + "' is inactive");
        }

        if (resource.getStatus() == ResourceStatus.OUT_OF_SERVICE
                || resource.getStatus() == ResourceStatus.UNDER_MAINTENANCE
                || resource.getStatus() == ResourceStatus.INACTIVE) {
            throw new BadRequestException("Resource '" + resource.getName() + "' is not currently bookable");
        }

        if (Boolean.TRUE.equals(resource.getBorrowed())) {
            throw new BadRequestException("Resource '" + resource.getName() + "' is currently borrowed");
        }

        if (resource.getCondition() == ResourceCondition.REPAIR_NEEDED) {
            throw new BadRequestException("Resource '" + resource.getName() + "' needs repair and cannot be booked");
        }

        if (resource.getCapacity() != null
                && expectedAttendees != null
                && expectedAttendees > resource.getCapacity()) {
            throw new BadRequestException(
                    "Expected attendees (" + expectedAttendees
                            + ") exceeds resource capacity (" + resource.getCapacity() + ")");
        }

        LocalTime availableFrom = resource.getAvailableFrom();
        LocalTime availableTo = resource.getAvailableTo();

        if (availableFrom != null && availableTo != null && !availableFrom.isBefore(availableTo)) {
            throw new BadRequestException(
                    "Resource '" + resource.getName() + "' has invalid availability window configured");
        }

        if (availableFrom != null && startTime.isBefore(availableFrom)) {
            throw new BadRequestException(
                    "Booking starts before resource availability window (from " + availableFrom + ")");
        }

        if (availableTo != null && endTime.isAfter(availableTo)) {
            throw new BadRequestException(
                    "Booking ends after resource availability window (until " + availableTo + ")");
        }
    }

    private String getResourceLabel(Booking booking) {
        return booking.getResource() != null && booking.getResource().getName() != null
                ? booking.getResource().getName()
                : "resource";
    }

    private void sendBookingNotificationSafely(Booking booking,
                                               NotificationType type,
                                               String title,
                                               String message) {
        try {
            notificationService.createNotification(
                    booking.getUser(),
                    type,
                    title,
                    message,
                    "BOOKING",
                    booking.getId());
        } catch (Exception ex) {
            // Notification failure should not fail booking lifecycle updates.
            log.warn("Notification creation failed for booking {}: {}", booking.getId(), ex.getMessage());
        }
    }
}
