package com.studyplanner.backend.repository;


import com.studyplanner.backend.entity.SuggestedLLM;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SuggestedTaskRepository extends JpaRepository<SuggestedLLM, Long> {

}
