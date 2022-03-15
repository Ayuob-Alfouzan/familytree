package com.familytree.web.rest.vm.familytree;

import com.familytree.domain.familytree.Person;
import java.util.List;

public class TreeResponseVM {

    private List<NodeResponseVM> nodes;

    private List<LinkResponseVM> links;

    public List<NodeResponseVM> getNodes() {
        return nodes;
    }

    public TreeResponseVM() {}

    public TreeResponseVM(List<NodeResponseVM> nodes, List<LinkResponseVM> links) {
        this.nodes = nodes;
        this.links = links;
    }

    public TreeResponseVM(List<Person> tree) {
        this.nodes = NodeResponseVM.fromEntity(tree);
        this.links = LinkResponseVM.toLinks(tree);
    }

    public void setNodes(List<NodeResponseVM> nodes) {
        this.nodes = nodes;
    }

    public List<LinkResponseVM> getLinks() {
        return links;
    }

    public void setLinks(List<LinkResponseVM> links) {
        this.links = links;
    }

    @Override
    public String toString() {
        return "TreeResponseVM{" + "nodes=" + nodes + ", links=" + links + '}';
    }
}
