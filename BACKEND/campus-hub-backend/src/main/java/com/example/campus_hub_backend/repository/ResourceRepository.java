package com.example.campus_hub_backend.repository;

import com.example.campus_hub_backend.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
}
