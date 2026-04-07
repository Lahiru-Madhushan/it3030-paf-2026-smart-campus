package com.example.campus_hub_backend.controller;

import com.example.campus_hub_backend.dto.ApiResponse;
import com.example.campus_hub_backend.dto.BookingRequest;
import com.example.campus_hub_backend.dto.BookingResponse;
import com.example.campus_hub_backend.dto.RejectRequest;
import com.example.campus_hub_backend.enumtype.BookingStatus;
import com.example.campus_hub_backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /** POST /api/bookings — Create a new booking request (any authenticated user) */
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        BookingResponse response = bookingService.createBooking(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** GET /api/bookings/my — Get bookings for the logged-in user */
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getMyBookings(authentication.getName()));
    }

    /** GET /api/bookings — Admin: get all bookings with optional filters */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long resourceId) {
        return ResponseEntity.ok(bookingService.getAllBookings(status, date, resourceId));
    }

    /** PATCH /api/bookings/{id}/approve — Admin approves a PENDING booking */
    @PatchMapping("/{id}/approve")
    public ResponseEntity<BookingResponse> approveBooking(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(bookingService.approveBooking(id, authentication.getName()));
    }

    /** PATCH /api/bookings/{id}/reject — Admin rejects a PENDING booking with a reason */
    @PatchMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable Long id,
            @Valid @RequestBody RejectRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, request.getReason(), authentication.getName()));
    }

    /** PATCH /api/bookings/{id}/cancel — Owner or admin cancels a PENDING/APPROVED booking */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, authentication.getName()));
    }

    /** PATCH /api/bookings/{id}/reschedule — Owner or admin updates booking slot/details */
    @PatchMapping("/{id}/reschedule")
    public ResponseEntity<BookingResponse> rescheduleBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(bookingService.rescheduleBooking(id, request, authentication.getName()));
    }

    /** DELETE /api/bookings/{id} — Admin hard-deletes a booking */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(new ApiResponse(true, "Booking deleted successfully"));
    }
}
