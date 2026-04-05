package com.example.campus_hub_backend.repository;

import com.example.campus_hub_backend.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ResourceRepository extends JpaRepository<Resource, Long>, JpaSpecificationExecutor<Resource> {
    boolean existsByResourceCode(String resourceCode);

    boolean existsByResourceCodeAndIdNot(String resourceCode, Long id);

    Optional<Resource> findByResourceCode(String resourceCode);
}
