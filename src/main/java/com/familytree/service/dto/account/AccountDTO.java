package com.familytree.service.dto.account;

import com.familytree.config.Constants;
import com.familytree.domain.account.User;
import com.familytree.domain.familytree.FamilyTreeUser;
import com.familytree.security.AuthoritiesConstants;
import com.familytree.service.dto.familytree.FamilyTreeUserDTO;
import com.familytree.service.dto.util.LookupDTO;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class AccountDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String type;
    private String mobileNumberCountryCode;
    private String mobileNumber;
    private String langKey;
    private byte[] thumbnail;
    private String fileContentType;
    private List<String> authorities;
    private List<FamilyTreeUserDTO> familyTreeList;

    public AccountDTO(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.type = user.getType();
        this.mobileNumberCountryCode = user.getMobileNumberCountryCode();
        this.mobileNumber = user.getMobileNumber();
        this.langKey = user.getLangKey();
        this.thumbnail = user.getThumbnail();
        this.fileContentType = user.getFileContentType();

        if (user.getType().equalsIgnoreCase(Constants.USER_KEY)) {
            this.authorities = Collections.singletonList(AuthoritiesConstants.USER);
        } else if (user.getType().equalsIgnoreCase(Constants.ADMIN_KEY)) {
            this.authorities = Collections.singletonList(AuthoritiesConstants.ADMIN);
        }

        if (user.getFamilyTreeUsers() != null && user.getFamilyTreeUsers().size() > 0) {
            this.familyTreeList =
                user
                    .getFamilyTreeUsers()
                    .stream()
                    .filter(FamilyTreeUser::getRecordActivity)
                    .map(
                        it -> {
                            FamilyTreeUserDTO familyTreeUserDTO = new FamilyTreeUserDTO();
                            familyTreeUserDTO.setFamilyTreeId(it.getFamilyTree().getId());
                            familyTreeUserDTO.setFamilyTreeNameAr(it.getFamilyTree().getNameAr());
                            familyTreeUserDTO.setFamilyTreeType(new LookupDTO(it.getFamilyTree().getType()));
                            familyTreeUserDTO.setId(it.getId());
                            familyTreeUserDTO.setType(new LookupDTO(it.getType()));
                            return familyTreeUserDTO;
                        }
                    )
                    .collect(Collectors.toList());
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<FamilyTreeUserDTO> getFamilyTreeList() {
        return familyTreeList;
    }

    public void setFamilyTreeList(List<FamilyTreeUserDTO> familyTreeList) {
        this.familyTreeList = familyTreeList;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public List<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(List<String> authorities) {
        this.authorities = authorities;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public String getLangKey() {
        return langKey;
    }

    public void setLangKey(String langKey) {
        this.langKey = langKey;
    }

    public byte[] getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(byte[] thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getFileContentType() {
        return fileContentType;
    }

    public void setFileContentType(String fileContentType) {
        this.fileContentType = fileContentType;
    }

    @Override
    public String toString() {
        return "AccountDTO{" +
            "id=" + id +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            ", email='" + email + '\'' +
            ", type='" + type + '\'' +
            ", mobileNumberCountryCode='" + mobileNumberCountryCode + '\'' +
            ", mobileNumber='" + mobileNumber + '\'' +
            ", langKey='" + langKey + '\'' +
            ", thumbnail=" + Arrays.toString(thumbnail) +
            ", fileContentType='" + fileContentType + '\'' +
            ", authorities=" + authorities +
            ", familyTreeList=" + familyTreeList +
            '}';
    }
}
