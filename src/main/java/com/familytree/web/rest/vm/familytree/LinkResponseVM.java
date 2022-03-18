package com.familytree.web.rest.vm.familytree;

import com.familytree.domain.familytree.Person;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class LinkResponseVM {

    private String source;

    private String target;

    private String relationship;

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public static List<LinkResponseVM> toLinks(List<Person> tree) {
        return tree
            .stream()
            .map(
                it -> {
                    List<LinkResponseVM> sons = new ArrayList<>();

                    if (it.getChildren() != null) {
                        sons =
                            it
                                .getChildren()
                                .stream()
                                .map(
                                    itt -> {
                                        LinkResponseVM link = new LinkResponseVM();
                                        link.setSource(it.getId().toString());
                                        link.setTarget(itt.getId().toString());
                                        link.setRelationship("SON");
                                        return link;
                                    }
                                )
                                .collect(Collectors.toList());
                    }

                    List<LinkResponseVM> wifes = new ArrayList<>();

                    if (it.getWives() != null) {
                        wifes =
                            it
                                .getWives()
                                .stream()
                                .map(
                                    itt -> {
                                        LinkResponseVM link = new LinkResponseVM();
                                        link.setSource(it.getId().toString());
                                        link.setTarget(itt.getId().toString());
                                        link.setRelationship("WIFE");
                                        return link;
                                    }
                                )
                                .collect(Collectors.toList());
                    }

                    sons.addAll(wifes);

                    return sons;
                }
            )
            .flatMap(Collection::stream)
            .collect(Collectors.toList());
    }

    @Override
    public String toString() {
        return "LinkResponseVM{" + "source=" + source + ", target=" + target + ", relationship='" + relationship + '\'' + '}';
    }
}
