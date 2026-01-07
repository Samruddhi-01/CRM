package com.startica.privateapp.config;

import com.startica.privateapp.model.Role;
import com.startica.privateapp.model.User;
import com.startica.privateapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create Admin user only if it doesn't exist
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("Admin User");
                admin.setEmail("admin@startica.com");
                admin.setPhone("1234567890");
                admin.setRole(Role.ADMIN);
                admin.setActive(true);
                userRepository.save(admin);
                System.out.println("✅ Created Admin user: admin / admin123");
            } else {
                System.out.println("ℹ️  Admin user already exists: admin");
            }

            // Create HR user only if it doesn't exist
            if (userRepository.findByUsername("hr").isEmpty()) {
                User hr = new User();
                hr.setUsername("hr");
                hr.setPassword(passwordEncoder.encode("hr123"));
                hr.setFullName("HR User");
                hr.setEmail("hr@startica.com");
                hr.setPhone("0987654321");
                hr.setRole(Role.HR);
                hr.setActive(true);
                userRepository.save(hr);
                System.out.println("✅ Created HR user: hr / hr123");
            } else {
                System.out.println("ℹ️  HR user already exists: hr");
            }

            System.out.println("\n🚀 Application ready! Available users:");
            System.out.println("   Admin: admin@startica.com / admin123");
            System.out.println("   HR: hr@startica.com / hr123");
        };
    }
}
