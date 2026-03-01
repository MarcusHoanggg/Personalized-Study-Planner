package com.studyplanner.backend.service;


import com.google.api.services.calendar.Calendar;
import com.studyplanner.backend.entity.Task;
import java.io.IOException;

public interface CalendarService {

    String pushToCalendar(Task task) throws IOException;

}
