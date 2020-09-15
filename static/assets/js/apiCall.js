let base_url = "";

const KPI_API = "kpi.json";
const COMPANY_API = "company.json";
const GOAL_LIST_API = "goalList.json";
const KPI_CHILD_API = "kpi_child.json";
const timeOut = 0;

isProduction = false;
initLS = false;
initLSInProgress = false;

const API = (url, data, method) => {
  try {
    const res = $.ajax({
      url: base_url + url,
      type: method,
      data: data,
      dataType: "json",
      contentType: "application/json",
      Accept: "application/json",
    });
    return res;
  } catch (err) {
    throw new Error("Unable to get response from server");
  }
};

const setLocalStorage = () => {
  if (!utils.storage.get("departmentList")) {
    utils.storage.set("departmentList", {
      id: 11,
      parentId: 0,
      name: "algotext",
      children: [],
    });
  }
};

const local = {
  init: (returnFunc) => {
    if (initLS && returnFunc) {
      returnFunc();
      return;
    } else if (initLS) {
      return;
    }
    initLSInProgress = true;
    API("/api/get-all", "", "GET")
      .done(function (response) {
        for (var prop in response) {
          if (Object.prototype.hasOwnProperty.call(response, prop)) {
            utils.storage.set(prop, response[prop]);
          }
        }
        initLS = true;
        initLSInProgress = false;
        if (returnFunc) {
          returnFunc();
        }
      })
      .fail(function (err, textStatus) {
        console.log(textStatus);
      });
  },

  updateChangeLog: (changeLog) => {
    var set = changeLog["set"];
    if (set) {
      for (var prop in set) {
        if (Object.prototype.hasOwnProperty.call(set, prop)) {
          API("/api/?filename=" + prop, JSON.stringify(set[prop]), "POST")
            .done(function (response) {
              console.log("updated: " + prop);
            })
            .fail(function (err, textStatus) {
              console.log(textStatus);
            });
        }
      }
    }
    var deleted = changeLog["deleted"];
    if (deleted) {
      for (var i = 0; i < deleted.length; i++) {
        API("/api/?filename=" + deleted[i], "", "DELETE")
          .done(function (response) {
            console.log("deleted: " + deleted[i]);
          })
          .fail(function (err, textStatus) {
            console.log(textStatus);
          });
      }
    }
  },

  getDepartments: () => {
    return new Promise((resolve) => {
      if (initLS) {
        setTimeout(() => resolve(utils.storage.get("departmentList")), timeOut);
      } else {
        this.api.init(function () {
          resolve(utils.storage.get("departmentList"));
        });
      }
    });
  },

  getDepartmentGoal: (id) => {
    return new Promise((resolve) => {
      if (!utils.storage.get(id)) {
        utils.storage.set(id, []);
      }
      setTimeout(() => resolve(utils.storage.get(id)), timeOut);
    });
  },

  deleteGoal: (id, deptId) => {
    return new Promise((resolve) => {
      const changeLog = deleteStorage_goal(id, deptId);
      this.api.updateChangeLog(changeLog);
      setTimeout(() => {
        resolve({ message: "success" });
      }, 800);
    });
  },

  setDepartment: (id, array) => {
    return new Promise((resolve) => {
      API(`/api/?filename=department${id}`, JSON.stringify(array), "POST")
        .done(function (response) {
          resolve(utils.storage.set(`department${id}`, response));
        })
        .fail(function (err, textStatus) {
          console.log(textStatus);
        });
    });
  },

  setGoalArray: (id, array) => {
    return new Promise((resolve) => {
      API(`/api/?filename=${id}`, JSON.stringify(array), "POST")
        .done(function (response) {
          resolve(utils.storage.set(id, response));
        })
        .fail(function (err, textStatus) {
          console.log(textStatus);
        });
    });
  },

  getChildDepartment: (id) => {
    return new Promise((resolve) => {
      if (!utils.storage.get("department" + id)) {
        utils.storage.set("department" + id, []);
      }
      setTimeout(() => resolve(utils.storage.get("department" + id)), timeOut);
    });
  },

  getGoalListOfParentDept: (deptId) => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            utils.storage.get(utils.storage.get("department" + deptId).parentId)
          ),
        timeOut
      );
    });
  },

  getParentDepartmentId: (id) => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(utils.storage.get("department" + id).parentId),
        timeOut
      );
    });
  },

  addDepartment: (name, parentId, deptID, selectDeptId) => {
    return new Promise((resolve) => {
      const changeLog = addDepartmentFunc(name, deptID, selectDeptId);
      this.api.updateChangeLog(changeLog);
      setTimeout(() => {
        resolve({ message: "success" });
      }, 800);
    });
  },

  editDepartment: (name, id, editDeptId, edit) => {
    const changeLog = editDepartmentFunc(name, id, editDeptId, edit);
    this.api.updateChangeLog(changeLog);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "success" });
      }, 800);
    });
  },

  deleteDepartment: (id, selectDeptId) => {
    return new Promise((resolve) => {
      var changeLog = deleteDepartmentFunc(id, selectDeptId);
      this.api.updateChangeLog(changeLog);
      setTimeout(() => {
        resolve({ message: "success" });
      }, 800);
    });
  },

  addNewGoal: (array, deptId, goalId) => {
    const changeLog = addNewGoalFunc(array, deptId, goalId);
    this.api.updateChangeLog(changeLog);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "success" });
      }, 800);
    });
  },

  getSingleGoalData: (goalID, edit) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (edit == true) {
          resolve(utils.storage.get("setGoal" + goalID));
        } else {
          resolve(utils.storage.get("editGoalDetail"));
        }
      }, timeOut);
    });
  },

  editGoal: (array, deptId, edit, goalId) => {
    const changeLog = editGoalFunc(deptId, edit, array, goalId);
    this.api.updateChangeLog(changeLog);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "success" });
      }, 500);
    });
  },
  setEditGoalArray: (id) => {
    const changeLog = {
      set: { editGoalDetail: utils.storage.get("setGoal" + id) },
    };
    this.api.updateChangeLog(changeLog);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          utils.storage.set("editGoalDetail", utils.storage.get("setGoal" + id))
        );
      }, 500);
    });
  },
};

const remote = {
  getDepartments: () => {
    return API("company.json", "", "GET");
  },

  getDepartmentGoal: () => {
    return API("kpi_child.json", "", "GET");
  },

  deleteGoal: (id) => {
    return API("kpi_child.json", id, "DELETE");
  },

  getChildDepartment: (id) => {
    return API("kpi_child.json", "", "GET");
  },

  addDepartment: (name, parentId) => {
    let data = {
      name: name,
      parentId: parentId,
    };
    return API("company.json", data, "POST");
  },

  getParentDepartmentId: (id) => {
    return API("company.json", id, "GET");
  },

  getGoalListOfParentDept: (deptId) => {
    return API("company.json", deptId, "GET");
  },

  editDepartment: (name, id) => {
    let data = {
      name: name,
      id: id,
    };
    return API("company.json", data, "PUT");
  },

  deleteDepartment: (id) => {
    return API("company.json", id, "DELETE");
  },

  getSingleGoalData: (goalID) => {
    return API("KPI_API?id=" + goalID, "", "GET");
  },

  addNewGoal: (array, deptId) => {
    return API("kpi_child.json?id=" + deptId, array, "POST");
  },

  editGoal: (array, deptId) => {
    return API("kpi_child.json?id=" + deptId, array, "PUT");
  },
};

if (!isProduction) {
  localStorage.clear();
  setLocalStorage();
  window.api = local;
  local.init();
} else {
  window.api = remote;
}
