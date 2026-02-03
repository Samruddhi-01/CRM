package com.startica.privateapp.appointment.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String candidateName;
    private String email;
    private String phone;

    private LocalDate appointmentDate;
    private LocalTime appointmentTime;

    private String company;
    private String profile;
    private String reference;

    @Column(length = 1000)
    private String notes;
}
