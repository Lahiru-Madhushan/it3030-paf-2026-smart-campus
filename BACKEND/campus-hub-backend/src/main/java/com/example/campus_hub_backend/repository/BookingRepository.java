package com.example.campus_hub_backend.repository;

import com.example.campus_hub_backend.entity.Booking;
import com.example.campus_hub_backend.enumtype.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Overlap detection: finds bookings for the same resource on the same date
     * whose time range overlaps with the requested range.
     * Overlap condition: newStart < existingEnd AND newEnd > existingStart
     * Only PENDING and APPROVED bookings block time slots.
     */
    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId " +
           "AND b.bookingDate = :bookingDate " +
           "AND b.startTime < :endTime " +
           "AND b.endTime > :startTime " +
           "AND b.status IN :statuses")
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("statuses") List<BookingStatus> statuses);

    @Query("SELECT b FROM Booking b WHERE b.id <> :excludeBookingId " +
          "AND b.resource.id = :resourceId " +
          "AND b.bookingDate = :bookingDate " +
          "AND b.startTime < :endTime " +
          "AND b.endTime > :startTime " +
          "AND b.status IN :statuses")
    List<Booking> findConflictingBookingsExcludingId(
           @Param("excludeBookingId") Long excludeBookingId,
           @Param("resourceId") Long resourceId,
           @Param("bookingDate") LocalDate bookingDate,
           @Param("startTime") LocalTime startTime,
           @Param("endTime") LocalTime endTime,
           @Param("statuses") List<BookingStatus> statuses);

    List<Booking> findByUserIdOrderByBookingDateDescStartTimeDesc(Long userId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    @Query("SELECT b FROM Booking b WHERE " +
           "(:status IS NULL OR b.status = :status) " +
           "AND (:date IS NULL OR b.bookingDate = :date) " +
           "AND (:resourceId IS NULL OR b.resource.id = :resourceId) " +
           "ORDER BY b.createdAt DESC")
    List<Booking> findAllWithFilters(
            @Param("status") BookingStatus status,
            @Param("date") LocalDate date,
            @Param("resourceId") Long resourceId);
}
