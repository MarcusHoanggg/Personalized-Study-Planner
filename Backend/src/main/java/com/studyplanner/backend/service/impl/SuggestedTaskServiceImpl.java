package com.studyplanner.backend.service.impl;


import com.studyplanner.backend.entity.SuggestedLLM;
import com.studyplanner.backend.repository.SuggestedTaskRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
@AllArgsConstructor
@Transactional
public class SuggestedTaskServiceImpl implements SuggestedTaskRepository {

    @Override
    public void flush() {

    }

    @Override
    public <S extends SuggestedLLM> S saveAndFlush(S entity) {
        return null;
    }

    @Override
    public <S extends SuggestedLLM> List<S> saveAllAndFlush(Iterable<S> entities) {
        return List.of();
    }

    @Override
    public void deleteAllInBatch(Iterable<SuggestedLLM> entities) {

    }

    @Override
    public void deleteAllByIdInBatch(Iterable<Long> longs) {

    }

    @Override
    public void deleteAllInBatch() {

    }

    @Override
    public SuggestedLLM getOne(Long aLong) {
        return null;
    }

    @Override
    public SuggestedLLM getById(Long aLong) {
        return null;
    }

    @Override
    public SuggestedLLM getReferenceById(Long aLong) {
        return null;
    }

    @Override
    public <S extends SuggestedLLM> Optional<S> findOne(Example<S> example) {
        return Optional.empty();
    }

    @Override
    public <S extends SuggestedLLM> List<S> findAll(Example<S> example) {
        return List.of();
    }

    @Override
    public <S extends SuggestedLLM> List<S> findAll(Example<S> example, Sort sort) {
        return List.of();
    }

    @Override
    public <S extends SuggestedLLM> Page<S> findAll(Example<S> example, Pageable pageable) {
        return null;
    }

    @Override
    public <S extends SuggestedLLM> long count(Example<S> example) {
        return 0;
    }

    @Override
    public <S extends SuggestedLLM> boolean exists(Example<S> example) {
        return false;
    }

    @Override
    public <S extends SuggestedLLM, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return null;
    }

    @Override
    public <S extends SuggestedLLM> S save(S entity) {
        return null;
    }

    @Override
    public <S extends SuggestedLLM> List<S> saveAll(Iterable<S> entities) {
        return List.of();
    }

    @Override
    public Optional<SuggestedLLM> findById(Long aLong) {
        return Optional.empty();
    }

    @Override
    public boolean existsById(Long aLong) {
        return false;
    }

    @Override
    public List<SuggestedLLM> findAll() {
        return List.of();
    }

    @Override
    public List<SuggestedLLM> findAllById(Iterable<Long> longs) {
        return List.of();
    }

    @Override
    public long count() {
        return 0;
    }

    @Override
    public void deleteById(Long aLong) {

    }

    @Override
    public void delete(SuggestedLLM entity) {

    }

    @Override
    public void deleteAllById(Iterable<? extends Long> longs) {

    }

    @Override
    public void deleteAll(Iterable<? extends SuggestedLLM> entities) {

    }

    @Override
    public void deleteAll() {

    }

    @Override
    public List<SuggestedLLM> findAll(Sort sort) {
        return List.of();
    }

    @Override
    public Page<SuggestedLLM> findAll(Pageable pageable) {
        return null;
    }
}
