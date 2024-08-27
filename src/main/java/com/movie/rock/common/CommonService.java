package com.movie.rock.common;

import java.time.LocalDate;
import java.time.Period;

public class CommonService {

    public class AgeCalculator{
        public static int calcuateAge(LocalDate memBirth) {
            LocalDate now = LocalDate.now();

            return Period.between(memBirth, now).getYears();
        }
    }
}
