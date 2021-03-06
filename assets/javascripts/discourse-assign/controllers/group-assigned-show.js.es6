import UserTopicsList from "discourse/controllers/user-topics-list";
import { alias } from "@ember/object/computed";
import { debounce } from "@ember/runloop";
import discourseComputed from "discourse-common/utils/decorators";
import { INPUT_DELAY } from "discourse-common/config/environment";

export default UserTopicsList.extend({
  user: Ember.inject.controller(),
  taskActions: Ember.inject.service(),
  order: "",
  ascending: false,
  search: "",
  bulkSelectEnabled: false,
  selected: [],
  canBulkSelect: alias("currentUser.staff"),

  queryParams: ["order", "ascending", "search"],

  @discourseComputed("search")
  searchTerm(search) {
    return search;
  },

  _setSearchTerm(searchTerm) {
    this.set("search", searchTerm);
    this.refreshModel();
  },

  refreshModel() {
    this.set("loading", true);
    this.store
      .findFiltered("topicList", {
        filter: this.model.filter,
        params: {
          order: this.order,
          ascending: this.ascending,
          search: this.search,
        },
      })
      .then((result) => this.set("model", result))
      .finally(() => {
        this.set("loading", false);
      });
  },

  actions: {
    unassign(topic) {
      this.taskActions
        .unassign(topic.get("id"))
        .then(() => this.send("changeAssigned"));
    },
    reassign(topic) {
      const controller = this.taskActions.assign(topic);
      controller.set("model.onSuccess", () => this.send("changeAssigned"));
    },
    changeSort(sortBy) {
      if (sortBy === this.order) {
        this.toggleProperty("ascending");
        this.refreshModel();
      } else {
        this.setProperties({ order: sortBy, ascending: false });
        this.refreshModel();
      }
    },
    onChangeFilter(value) {
      debounce(this, this._setSearchTerm, value, INPUT_DELAY * 2);
    },
    toggleBulkSelect() {
      this.toggleProperty("bulkSelectEnabled");
    },
    refresh() {
      this.refreshModel();
    },
  },
});
