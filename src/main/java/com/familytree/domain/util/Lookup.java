package com.familytree.domain.util;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "lookup")
public class Lookup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "category")
    @NotNull
    @Size(min = 1, max = 255)
    private String category;

    @Column(name = "code")
    @NotNull
    @Size(min = 1, max = 50)
    private String code;

    @Column(name = "ar")
    @Size(max = 255)
    private String ar;

    @Column(name = "en")
    @Size(max = 255)
    private String en;

    @Column(name = "ur")
    @Size(max = 255)
    private String ur;

    @Column(name = "record_activity")
    private Boolean recordActivity;

    @Column(name = "record_order")
    private Integer order;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAr() {
        return ar;
    }

    public void setAr(String ar) {
        this.ar = ar;
    }

    public String getEn() {
        return en;
    }

    public void setEn(String en) {
        this.en = en;
    }

    public Boolean getRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public String getUr() {
        return ur;
    }

    public void setUr(String ur) {
        this.ur = ur;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Lookup)) {
            return false;
        }
        return id != null && id.equals(((Lookup) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return (
            "Lookup{" +
            "id=" +
            id +
            ", category='" +
            category +
            '\'' +
            ", code='" +
            code +
            '\'' +
            ", ar='" +
            ar +
            '\'' +
            ", en='" +
            en +
            '\'' +
            ", ur='" +
            ur +
            '\'' +
            ", recordActivity=" +
            recordActivity +
            ", order=" +
            order +
            '}'
        );
    }
}
