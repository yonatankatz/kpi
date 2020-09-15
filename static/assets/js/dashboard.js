$("#dialog").dialog({
  autoOpen: false,
  modal: true,
});

let setDept = async (id, array) => {
  try {
    await api.setDepartment(id, array);
  } catch (e) {
    console.log(e);
    toastr.error("Enable to get Department");
  }
};

let setGoalArray = async (id, array) => {
  try {
    await api.setGoalArray(id, array);
  } catch (e) {
    console.log(e);
    toastr.error("Enable to get goals");
  }
};

let departmentHierarchy = (result, deptId, paddingClass) => {
  result.children.map((item, index) => {
    let listId = document.getElementById(deptId);
    if (api.setDepartment) {
      setDept(item.id, item);
    }
    listId.appendChild(
      departmentList(
        item.id,
        item.name,
        item.id,
        paddingClass,
        item.children.length
      )
    );
    if (item.children && item.children.length) {
      $("#deptColId" + item.id).append(
        '<li class="p-1 position-relative radioButton"></li>'
      );
      departmentHierarchy(item, "deptColId" + item.id, "pl-2");
    }
  });
};

let setDepartment = (result) => {
  $("#department").empty();
  let department = document.querySelector("#addNewDepartment");
  if (result) {
    if (result.id) {
      department.firstElementChild.setAttribute("id", "dep" + result.id);
      department.firstElementChild.setAttribute("value", result.id);
      $("#dep" + result.id).prop("checked", true);
      department.lastElementChild.children[1].textContent = capitalize(
        result.name
      );
      department.lastElementChild.setAttribute("for", "dep" + result.id);
      if (api.setDepartment) {
        setDept(result.id, result);
      }
    } else {
      department.firstElementChild.setAttribute("id", "dep1");
      department.firstElementChild.setAttribute("value", 1);
      $("#dep" + result.id).prop("checked", true);
      department.lastElementChild.children[1].textContent = capitalize(
        "Management"
      );
      department.lastElementChild.setAttribute("for", "dep1");
      let array = {
        id: 1,
        parentId: 0,
        name: "Management",
        children: [],
      };
      if (api.setDepartment) {
        setDept(1, result);
      }
    }

    $("#collapseExample").addClass("show");
    if (result.children && result.children.length) {
      $("#toggleArrow").removeClass("d-none");
      $("#department").append(
        '<li class="p-1 position-relative radioButton"></li>'
      );
      departmentHierarchy(result, "department", "pl-2");
    }
    // if(result.parentId == 0){
    //     $('#changeDeptParent').addClass('d-none');
    // }
    // else{
    //     $('#changeDeptParent').removeClass('d-none');
    // }
  }

  //$('.dir').find('.childLi').slideUp(500);
  $(".dir")
    .find("i")
    .click(function (e) {
      let closestLabel = $(this)[0].closest("label");
      let iconTag = $(this)[0]; //.firstElementChild.firstElementChild;
      if (closestLabel.childElementCount == 2) {
        if (iconTag.classList.contains("fa-caret-right")) {
          iconTag.classList.remove("fa-caret-right");
          iconTag.classList.add("fa-caret-down");
        } else {
          iconTag.classList.remove("fa-caret-down");
          iconTag.classList.add("fa-caret-right");
        }
      }

      $(closestLabel)
        .next("ul")
        .slideToggle(500, () => {
          $(this).show();
        });
    });

  goalDetail();

  let current_url = window.location.href;
  if (current_url.indexOf("?") >= 0) {
    let split = current_url.split("?")[1].split("/");
    $("#dep" + split[1]).prop("checked", true);
    goalDetail();
  }

  $("#DeptForm input[type=radio]").on("change", () => {
    if (
      $("input[name=radio]:checked", "#DeptForm").val() != "addNewDepartment"
    ) {
      goalDetail();
    }
  });
};

window.onload = async () => {
  try {
    const department = await api.getDepartments();
    setDepartment(department);
  } catch (error) {
    alert(error.message ? error.message : JSON.stringify(error));
  }
};

let listViewChildren = (result, id, i, goalIndex) => {
  result.map((item, index) => {
    if (api.setGoalArray) {
      setGoalArray("setGoal" + item.goal.goalId, item);
    }
    $(id).append(
      '<li class="no-border pt-4 line_height">GOAL #' +
        goalIndex +
        "_" +
        (index + 1) +
        "</li>"
    );
    let listChildId = document.querySelector(id);
    listChildId.appendChild(
      listView(
        item.goal.goalId,
        item.goal.description,
        editKPI,
        removeKPI,
        "editGoal" + item.goal.goalId,
        "delete" + item.goal.goalId,
        "a",
        "a",
        "a"
      )
    );

    item.measurements.map((item1, index1) => {
      if (index1 == 0) {
        $("#collapseList" + item.goal.goalId).append(
          '<li class="collapse no-border pt-4 collapseList' +
            item.goal.goalId +
            '">KPIS</li>'
        );
      }
      let MeasurementGoalIdChild = document.querySelector(
        "#collapseList" + item.goal.goalId
      );
      MeasurementGoalIdChild.appendChild(
        listMeasurementGoal(
          item.goal.goalId,
          item1.description,
          item1.type,
          item1.dueDate,
          item1.actual
        )
      );
    });

    item.actions.map((item2, index2) => {
      if (index2 == 0) {
        $("#collapseList" + item.goal.goalId).append(
          '<li class="no-border pt-4 collapse collapseList' +
            item.goal.goalId +
            '">ACTION ITEMS</li>'
        );
      }
      let MeasurementGoalIdChild = document.querySelector(
        "#collapseList" + item.goal.goalId
      );
      MeasurementGoalIdChild.appendChild(
        listMeasurementGoal(item.goal.goalId, item2.text, "", "", item2.done)
      );
    });
    // if(item.children && item.children.length){
    //     listViewChildren(item.children, '#collapseList'+item.goal.goalId, '', goalIndex+'_'+(index+1));
    // }
  });
};

let setGoal = (result) => {
  if (result && result.length) {
    $("#listView").removeClass("d-none");
    $("#NotFound").addClass("d-none");
    $("#listViewStructure").empty();
    result.map((item, index) => {
      if (api.setGoalArray) {
        setGoalArray("setGoal" + item.goal.goalId, item);
      }
      $("#listViewStructure").append(
        '<li class="no-border pt-2 border-0 pl-0 line_height">GOAL #' +
          (index + 1) +
          "</li>"
      );
      let listId = document.querySelector("#listViewStructure");
      listId.appendChild(
        listView(
          item.goal.goalId,
          item.goal.description,
          editKPI,
          removeKPI,
          "editGoal" + item.goal.goalId,
          "delete" + item.goal.goalId,
          "no-border",
          "pl-0",
          "border-0"
        )
      );

      item.measurements.map((item1, index1) => {
        if (index1 == 0) {
          $("#collapseList" + item.goal.goalId).append(
            '<li class="collapse no-border pt-4 collapseList' +
              item.goal.goalId +
              '">KPIS</li>'
          );
        }
        let MeasurementGoalId = document.querySelector(
          "#collapseList" + item.goal.goalId
        );
        MeasurementGoalId.appendChild(
          listMeasurementGoal(
            item.goal.goalId,
            item1.description,
            item1.type,
            item1.dueDate,
            item1.actual
          )
        );
      });

      item.actions.map((item2, index2) => {
        if (index2 == 0) {
          $("#collapseList" + item.goal.goalId).append(
            '<li class="no-border pt-4 collapse collapseList' +
              item.goal.goalId +
              '">ACTION ITEMS</li>'
          );
        }

        let actionGoalId = document.querySelector(
          "#collapseList" + item.goal.goalId
        );
        actionGoalId.appendChild(
          listMeasurementGoal(item.goal.goalId, item2.text, "", "", item2.done)
        );
      });

      if (item.children) {
        listViewChildren(
          item.children,
          "#collapseList" + item.goal.goalId,
          result.length + index,
          index + 1
        );
      }
    });
    let current_url = window.location.href;
    if (current_url.indexOf("?") >= 0) {
      let split = current_url.split("?")[1].split("/");
      document.getElementById("goal-id" + split[0]).scrollIntoView({
        behavior: "smooth",
      });
    }
  } else {
    $("#listView").addClass("d-none");
    $("#NotFound").removeClass("d-none");
  }
};

let goalDetail = async () => {
  try {
    let deptName = document.getElementById(
      "dep" + $("input[name=radio]:checked", "#DeptForm").val()
    );
    $("#viewDept").text(
      "KPI Overview for " + capitalize(deptName.nextElementSibling.textContent)
    );
    const departmentGoals = await api.getDepartmentGoal(
      $("input[name=radio]:checked", "#DeptForm").val()
    );
    setGoal(departmentGoals);
  } catch (e) {
    console.log(e);
    toastr.error("Enable to get Goal");
  }
};

/** Start:: Delete KPI */
removeKPI = (elem) => {
  let removeGoalFunction = () => {
    let remove = () => {
      elem.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.remove();
      elem.target.parentElement.parentElement.parentElement.parentElement.remove();
    };
    let deleteKPI = async () => {
      try {
        await api.deleteGoal(
          elem.target.getAttribute("id").replace("delete", ""),
          $("input[name=radio]:checked", "#DeptForm").val(),
          elem
        );
        remove();
      } catch (e) {
        console.log(e);
        toastr.error("Enable to delete Goal");
      }
    };
    deleteKPI();
    $("#dialog").dialog("close");
  };
  deleteConfirmationFunction(
    removeGoalFunction,
    elem.target.parentElement.parentElement.parentElement.firstElementChild
      .textContent
  );
};

/** End:: Delete KPI */

/** Start:: Edit KPI */

editKPI = (elem) => {
  if (api.setGoalArray) {
    let goalArray = async () => {
      try {
        await api.setEditGoalArray(
          elem.target.getAttribute("id").replace("editGoal", "")
        );
        window.location =
          "newKPI.html?edit=" +
          $("input[name=radio]:checked", "#DeptForm").val();
      } catch (e) {
        console.log(e);
        toastr.error("Enable to delete Goal");
      }
    };
    goalArray();
  } else {
    window.location =
      "newKPI.html?edit=" + $("input[name=radio]:checked", "#DeptForm").val();
  }
};

/** End:: Edit KPI */

$("#addNewGoal").click(() => {
  window.location =
    "newKPI.html?new=" + $("input[name=radio]:checked", "#DeptForm").val();
});

$("#refresh").click(() => {
  localStorage.clear();
  location.reload();
});
