package com.movie.rock.admin.data;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class AdminAddMoviePk implements Serializable {

    @Column(name = "director_id")
    private int directorId;

    @Column(name = "actor_id")
    private int actorId;

    //기본 생성자
    public AdminAddMoviePk() {}

    public AdminAddMoviePk(int actorId, int directorId) {
        this.actorId = actorId;
        this.directorId = directorId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AdminAddMoviePk)) return false;
        AdminAddMoviePk that = (AdminAddMoviePk) o;
        return Objects.equals(getDirectorId(), that.getDirectorId()) &&
                Objects.equals(getActorId(), that.getActorId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getDirectorId(), getActorId());
    }
    // 생성자, Getter, Setter 등 필요한 코드 작성

    public int getDirectorId() {
        return directorId;
    }

    public void setDirectorId(int directorId) {
        this.directorId = directorId;
    }

    public int getActorId() {
        return actorId;
    }

    public void setActorId(int actorId) {
        this.actorId = actorId;
    }
}
