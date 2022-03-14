package com.familytree.domain.account;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.familytree.domain.familytree.FamilyTreeUser;
import com.familytree.domain.util.AbstractAuditingEntity;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * A user.
 */
@Entity
@Table(name = "ft_user")
public class User extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @JsonIgnore
    @Size(min = 60, max = 60)
    @Column(name = "password", length = 60, nullable = true)
    private String password;

    @NotNull
    @Size(min = 0, max = 15)
    @Column(name = "first_name", length = 15)
    private String firstName;

    @NotNull
    @Size(min = 0, max = 15)
    @Column(name = "last_name", length = 15)
    private String lastName;

    @NotNull
    @Email
    @Size(min = 5, max = 255)
    @Column(name = "email", length = 255, unique = true)
    private String email;

    @NotNull
    @Size(min = 1, max = 10)
    @Column(name = "type", length = 10)
    private String type;

    @Size(max = 5)
    @Column(name = "mobile_number_country_code", length = 5)
    private String mobileNumberCountryCode;

    @Size(max = 10)
    @Column(name = "mobile_number", length = 10)
    private String mobileNumber;

    @NotNull
    @Column(name = "activated", nullable = false)
    private Boolean activated = false;

    @NotNull
    @Size(min = 2, max = 10)
    @Column(name = "lang_key", length = 10)
    private String langKey;

    @Size(max = 255)
    @Column(name = "token", length = 255)
    @JsonIgnore
    private String token;

    @Lob
    @Column(name = "file_content")
    private byte[] file;

    @Lob
    @Column(name = "thumbnail")
    private byte[] thumbnail;

    @Column(name = "file_content_type")
    @Size(max = 255)
    private String fileContentType;

    @NotNull
    @Column(name = "record_activity", nullable = false)
    private Boolean recordActivity = true;

    @Column(name = "most_reset_password")
    private Boolean mostResetPassword = false;

    @OneToMany(mappedBy = "user")
    private List<FamilyTreeUser> familyTreeUsers = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public User id(Long id) {
        this.id = id;
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public List<FamilyTreeUser> getFamilyTreeUsers() {
        return familyTreeUsers;
    }

    public void setFamilyTreeUsers(List<FamilyTreeUser> familyTreeUsers) {
        this.familyTreeUsers = familyTreeUsers;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public Boolean getMostResetPassword() {
        return mostResetPassword;
    }

    public void setMostResetPassword(Boolean mostResetPassword) {
        this.mostResetPassword = mostResetPassword;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean isActivated() {
        return activated;
    }

    public void setActivated(Boolean activated) {
        this.activated = activated;
    }

    public String getLangKey() {
        return langKey;
    }

    public void setLangKey(String langKey) {
        this.langKey = langKey;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Boolean isRecordActivity() {
        return recordActivity;
    }

    public void setRecordActivity(Boolean recordActivity) {
        this.recordActivity = recordActivity;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }

    public String getFileContentType() {
        return fileContentType;
    }

    public byte[] getThumbnail() {
        return thumbnail;
    }

    public String getMobileNumberCountryCode() {
        return mobileNumberCountryCode;
    }

    public void setMobileNumberCountryCode(String mobileNumberCountryCode) {
        this.mobileNumberCountryCode = mobileNumberCountryCode;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public void setThumbnail(byte[] thumbnail) {
        this.thumbnail = thumbnail;
    }

    public void setFileContentType(String fileContentType) {
        this.fileContentType = fileContentType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof User)) {
            return false;
        }
        return id != null && id.equals(((User) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return (
            "User{" +
            "id=" +
            id +
            ", password='" +
            password +
            '\'' +
            ", firstName='" +
            firstName +
            '\'' +
            ", lastName='" +
            lastName +
            '\'' +
            ", email='" +
            email +
            '\'' +
            ", mobileNumber='" +
            mobileNumber +
            '\'' +
            ", mobileNumberCountryCode='" +
            mobileNumberCountryCode +
            '\'' +
            ", type='" +
            type +
            '\'' +
            ", activated=" +
            activated +
            ", langKey='" +
            langKey +
            '\'' +
            ", token='" +
            token +
            '\'' +
            ", recordActivity=" +
            recordActivity +
            ", mostResetPassword=" +
            mostResetPassword +
            '}'
        );
    }
}
