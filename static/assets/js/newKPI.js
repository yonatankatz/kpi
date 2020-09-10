$("#date").datepicker(
    { dateFormat: 'dd-mm-yy' }
);

$("#dialog").dialog({
    autoOpen: false,
    modal: true
});

let current_url = window.location.href;
let split = current_url.split('=');
let deptObj = [];
let measurementObj = [];
let actionObj = [];
/** Start:: Get department list */

let deptList = (result) => {
    // console.log(result)
    $('#setDept').empty();
    $('#setDept')
        .append($("<option></option>").attr("value",result.id).text(capitalize(result.name)));
    if(result.children && result.children.length){
        result.children.map( (item, index) => {
            $('#setDept')
            .append($("<option></option>").attr("value",item.id).text(capitalize(item.name)));
        });
    }
    $('#setDept').append('<option value="" disabled="disabled">───────────────────</option>');
    $('#setDept').append($("<option></option>").attr('value', 'createDep').attr('data-toggle', 'modal').attr('data-target', '#addNewDept').text('Add new department under '+capitalize(result.name)).addClass('cursor_pointer'));
    goalDetail1();
}

$('#setDept').change( () => {
    if($("#setDept option:selected" ).val() == 'createDep'){
        $('#deptListItem').empty();
        $('#addNewDept').modal('show');
        let addDept = document.querySelector('#deptListItem');
        // let deptID = Math.floor(Math.random() * 1000) + 1;
        deptObj = [];
        let dept = (list) => {
            $('#departmentRenameInput').val(capitalize(list.name));
            list.children.map( (item, index) => {
                addDept.appendChild(goalMeasurement(capitalize(item.name), 'newDeptId'+item.id, 'deptEdit'+item.id, 'deptDelete'+item.id, '', '', 'newDeptList', item.id, editDept, removeDept));
                deptObj.push(departmentArray(item.id, parseInt(split[1]), item.name));
            });
        }
        let deptDetail = async() => {
            try {
                const departmentChild = await api.getChildDepartment(split[1]);
                dept(departmentChild);
            } catch (error) {
                console.log(error)
                toastr.error("Enable to get departments");
            }
        }
        deptDetail();
    }
    else{
        goalDetail1();
    }
})

$('#modelClose').click( () => {
    getDepartmentList();
})

window.onload = async() => {
    getDepartmentList();
}

let getDepartmentList = async() => {
    try {
        const departmentChild = await api.getChildDepartment(split[1]);
        deptList(departmentChild);
    } catch (error) {
        console.log(error)
        toastr.error("Enable to get departments");
    }
}

/** End:: Get department list */


/** Start:: Set Goals Detail */

let goalDetailArray = () => {
    // if($("#selectGoal option:selected").val() != 'parentGoal'){
    if(current_url.includes('edit=')){
        $('#newGoal').text('Save Goal');
        $('#goalType').text('Edit Goal')
        let editGoalDetail = (detail) => {
            $('#disableKPI').removeClass('disableDiv');
            let parentGoalSelect = detail.goal.parentGoalId == 0 ? 'createDep' : detail.goal.parentGoalId;
            $('#selectGoal option[value='+parentGoalSelect+']').attr('selected','selected');
            $('#goalActions').empty();
            $('#goalMeasurement').empty();
            $('#goalDes').val(capitalize(detail.goal.description));
            $('#goalDes').attr('goalId', detail.goal.goalId);
            $('#goalDes').attr('department', detail.department);
            $('#setDept').addClass('disableDiv');
            $('#selectGoal').addClass('disableDiv');
            let app = document.querySelector('#goalMeasurement');
            detail.measurements.map( (item, index) => {
                app.appendChild(goalMeasurement(capitalize(item.description), 'KPIDesc'+item.measureId, 'edit'+item.measureId, 'delete'+item.measureId, item.type, item.dueDate, 'KPIdes', item.measureId, editKPI, removeKPI, item.target, item.actual));
                measurementObj.push(item);
            });

            let actions = document.querySelector('#goalActions');
            detail.actions.map( (item, index) => {
                actions.appendChild(goalMeasurement(capitalize(item.text), 'action'+item.actionId, 'actionEdit'+item.actionId, 'actionDelete'+item.actionId, 'number', '', 'actionList', item.actionId, editActions, removeAction, '', item.done));
                actionObj.push(item);
            });
        }

        let editGoal = async() => {
            try {
                const singleGoal = await api.getSingleGoalData(split[1]);
                editGoalDetail(singleGoal);
            } catch (error) {
                console.log(error)
                toastr.error("Enable to get goal detail");
            }
        }
        editGoal();
    }
    else{
        $('#goalActions').empty();
        $('#goalMeasurement').empty();
    }
}

if($('#goalDes').val() == '' ){
    $('#disableKPI').addClass('disableDiv');
}

$('#goalDes').change( () => {
    if($('#goalDes').val() == '' ){
        $('#disableKPI').addClass('disableDiv');
    }
    else{
        $('#disableKPI').removeClass('disableDiv');
    }
})

let goalDetail1 = () => {
    $('#selectGoal').empty();
    $('#selectGoal').append(($("<option></option>").attr("value",'parentGoal').text(capitalize('Select a parent goal'))));
    let getDepartmentParentList = async() => {
        try {
            const parentGoal = await api.getGoalListOfParentDept($("#setDept option:selected").val());
            if(parentGoal){
                parentGoal.map( (item, index) => {
                    if($('#goalDes').val() != capitalize(item.goal.description)){
                        $('#selectGoal').append(($("<option></option>").attr("value",item.goal.goalId).text(capitalize(item.goal.description))));
                    }
                });
            }
            goalDetailArray();
        } catch (error) {
            console.log(error)
            toastr.error("Enable to get departments");
        }
    };
    getDepartmentParentList();
}

/** End:: Set Goals Detail */


/** Start:: Add new department */

$('#renameDepartment').click( (e) => {
    e.preventDefault();
    if($('#departmentRenameInput').val() != '' && ($('#departmentRenameInput').val().replace(/\s/g, '').length)){

        let edit = () => {
            getDepartmentList();
            $('#renameDept')[0].reset();
            $('#addNewDept').modal('toggle');
        }

    let editDepartment = async() => {
        try{
            const department = await api.editDepartment($('#departmentRenameInput').val(), split[1], '', true);
            edit(department);
        } catch(err) {
            toastr.error("Enable to Edit Department");
            console.log(err)
        }
    }
    editDepartment();
    }
    else{
        toastr.error('Please fill the input');
    }
})

$('#addDepartment').click( (e) => {
    e.preventDefault();
    if($('#departmentInput').val() != '' && ($('#departmentInput').val().replace(/\s/g, '').length)){
        let deptID = Math.floor(Math.random() * 1000) + 1;
        let add = (result) => {
            let addDept = document.querySelector('#deptListItem');
            addDept.appendChild(goalMeasurement($('#departmentInput').val(), 'newDeptId'+deptID, 'deptEdit'+deptID, 'deptDelete'+deptID, '', '', 'newDeptList', deptID, editDept, removeDept));
            deptObj.push(departmentArray(deptID, parseInt(split[1]), $('#departmentInput').val()));
            getDepartmentList();
            $('#AddDeptForm')[0].reset();
            $('#addNewDept').modal('toggle');
        }
        let parentID;
        let addDepartment = async() => {
            try{
                let parentDepartment = async() => {
                    try{
                        parentID = await api.getParentDepartmentId(parseInt(split[1]));
                    } catch(err) {
                        toastr.error("Enable to Get parent Department");
                        console.log(err)
                    }
                }
                parentDepartment();
                const addDepartment = await api.addDepartment($('#departmentInput').val(), parentID, deptID, parseInt(split[1]));
                add(addDepartment);
            } catch(err) {
                toastr.error("Enable to Add Department");
                console.log(err)
            }
        }
        addDepartment();
    }
    else{
        toastr.error('Please fill the input');
    }
})

let editDeptId;
editDept = (e) => {
    $('#departmentInput').val();
    $('#addDepartment').addClass('d-none');
    $('#editDepartment').removeClass('d-none');
    let editId = (e.target).getAttribute('id').replace('deptEdit','');
    editDeptId = editId;
    deptObj.map( (item, index) => {
        if(item.id == editId){
            $('#departmentInput').val(capitalize(item.name));
        }
    })
}

$('#editDepartment').click ( (e) => {
    e.preventDefault();
    if($('#departmentInput').val() != '' && ($('#departmentInput').val().replace(/\s/g, '').length)){
        let edit = () => {
            $('#newDeptId'+editDeptId).text($('#departmentInput').val());
            getDepartmentList();
            if(!isProduction){
            }
            $('#AddDeptForm')[0].reset();
            $('#addNewDept').modal('toggle');
            $('#editDepartment').addClass('d-none');
            $('#addDepartment').removeClass('d-none');

        }
        let editDepartment = async() => {
            try{
                const department = await api.editDepartment($('#departmentInput').val(), split[1], editDeptId, false);
                edit(department);
            } catch(err) {
                toastr.error("Enable to Edit Department");
                console.log(err)
            }
        }
        editDepartment();
    }
    else{
        toastr.error('Please fill the input');
    }
})

removeDept = (e) => {
    let removeDeptFunction = () => {
        let remove = (result) => {
            getDepartmentList();
            $('#AddDeptForm')[0].reset();
        }
        let deleteKPI = async() => {
            try{
                const deleteDept = await api.deleteDepartment(parseInt(e.target.getAttribute('id').replace('deptDelete', '')), parseInt(split[1]));
                remove(deleteDept);
            } catch(e) {
                console.log(e)
                toastr.error("Enable to delete Department");
            }
        }
        deleteKPI();
        $("#dialog").dialog("close");
    }
    $('#addNewDept').modal('toggle');
    deleteConfirmationFunction(removeDeptFunction, e.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.textContent);
}
/** End:: Add new department */


/** Start:: Add Action */
$('#addAction').click ( () => {
    if($('#actionInput').val() != '' && ($('#actionInput').val().replace(/\s/g, '').length)){
        let addActions = document.querySelector('#goalActions');
        let actionID = Math.floor(Math.random() * 1000) + 1;
        addActions.appendChild(goalMeasurement(capitalize($('#actionInput').val()), 'action'+actionID, 'actionEdit'+actionID, 'actionDelete'+actionID, 'number', '', 'actionList', actionID, editActions, removeAction));
        actionObj.push(actionArray(actionID, $('#actionInput').val()));
        $('#actionInput').val('');
    }
    else{
        toastr.error('Please fill the input');
    }
})
/** End:: Add Action */

/** Start:: Add KPI */
$('#addKPI').click ( (e) => {
    e.preventDefault();
    if(($('#KPI').val() != '') && ($("#selectMetric option:selected" ).val() != 'default') && ($('#KPI').val().replace(/\s/g, '').length)){
        if($("#selectMetric option:selected" ).val() == 'number'){
            if($('#targetNumber').val() == '' || (parseInt($('#targetNumber').val()) < 0 )){
                toastr.error("Add proper input field");
                return;
            }
        }
        let addKPI = document.querySelector('#goalMeasurement');
        let KPI_ID = Math.floor(Math.random() * 1000) + 1;
        if( $("#selectMetric option:selected").val() == 'flag'){
            $('#targetNumber').val('');
        }
        let newDate = $('#date').val() == '' ? '' : Date.parse(new Date($('#date').val().replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")));

        addKPI.appendChild(goalMeasurement(capitalize($('#KPI').val()), 'KPIDesc'+KPI_ID, 'edit'+KPI_ID, 'delete'+KPI_ID, $("#selectMetric option:selected" ).val(), newDate, 'KPIdes', KPI_ID, editKPI, removeKPI, $('#targetNumber').val()));
        measurementObj.push(measurementArray(KPI_ID, $('#KPI').val(), $("#selectMetric option:selected" ).val(), $('#targetNumber').val(), newDate))

        $('#targetNumber').parent('div').removeClass('d-none');
        $('#date').parent('div').removeClass('d-none');
        $('#AddKPIForm')[0].reset();
    }
    else{
        toastr.error('Please fill proper input field');
    }
})

/** End:: Add KPI */

/** Start:: Delete KPI */
removeKPI = (e) => {
    let removeKPIFunction = () => {
        e.target.parentElement.parentElement.parentElement.remove();
        $("#dialog").dialog("close");
    }
    deleteConfirmationFunction(removeKPIFunction, e.target.parentElement.parentElement.parentElement.firstElementChild.textContent);
}

/** End:: Delete KPI */

/** Start:: Delete Actions */
removeAction = (e) => {
    let removeActionFunction = () => {
        e.target.parentElement.parentElement.parentElement.remove();
        $("#dialog").dialog("close");
    }
    deleteConfirmationFunction(removeActionFunction, e.target.parentElement.parentElement.parentElement.firstElementChild.textContent);
}

/** End:: Delete Actions */


/** Start:: Edit KPI */

let editMeasurementId;
editKPI = (e) => {
    $('#AddKPIForm')[0].reset();
    $('#selectMetric').prop('selectedIndex',0);
    $('#addKPI').addClass('d-none');
    $('#editKPI').removeClass('d-none');
    let editId = (e.target).getAttribute('id').replace('edit','');
    editMeasurementId = editId;
    measurementObj.map( (item, index) => {
        if(item.measureId == editId){
            $('#KPI').val(item.description);
            if(item.dueDate){
                $('#date').val(milliseconds(item.dueDate));
            }
            if(item.type != 'number'){
                $('#targetNumber').parent('div').addClass('d-none');
                $('#selectMetric option[value=flag]').prop('selected', true);
                $('#selectMetric option[value=flag]').attr('selected','selected');
            }
            else{
                $('#targetNumber').parent('div').removeClass('d-none');
                $('#targetNumber').val(item.target);
                $('#selectMetric option[value=number]').prop('selected', true);
                $('#selectMetric option[value=number]').attr('selected','selected');
            }
        }
    });
}

$('#editKPI').click ( (e) => {
    e.preventDefault();
    if(($('#KPI').val() != '') && ($("#selectMetric option:selected" ).val() != 'default') && ($('#KPI').val().replace(/\s/g, '').length)){
        $('#KPIDesc'+editMeasurementId).text($('#KPI').val());
        if($('#date').val() != ''){
            $('#date'+editMeasurementId).text('Due '+$('#date').val());
            $('#date'+editMeasurementId).removeClass('d-none');
        }
        if( $("#selectMetric option:selected").val() == 'flag'){
            $('#number'+editMeasurementId).text('');
            $("#selectMetric option:selected").val('flag');
        }
        if($("#selectMetric option:selected").val() == 'number'){
            if($('#targetNumber').val() == ''){
                toastr.error("Add proper input field");
                return;
            }
            if((parseInt($('#targetNumber').val()) < 0 )){
                toastr.error("Add proper input field");
                return;
            }
            $('#number'+editMeasurementId).text($('#targetNumber').val());
            $("#selectMetric option:selected").val('number');
        }
        let newDate = $('#date').val() == '' ? '' : Date.parse(new Date($('#date').val().replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")));

        measurementObj.map( (item, index) => {
            if(item.measureId == editMeasurementId){
                item.description = capitalize($('#KPI').val());
                item.dueDate = newDate;
                item.type = $("#selectMetric option:selected").val();
                item.target = $('#targetNumber').val()
            }
        });

        $('#AddKPIForm')[0].reset();
        $('#editKPI').addClass('d-none');
        $('#addKPI').removeClass('d-none');
        $('#targetNumber').parent('div').removeClass('d-none');
        $('#date').parent('div').removeClass('d-none');
    }
    else{
        toastr.error('Please fill proper input field');
    }
})

/** End:: Edit KPI */


/** Start:: Edit Actions */

let editActionId;
editActions = (e) => {
    $('#addAction').addClass('d-none');
    $('#editAction').removeClass('d-none');
    let editId = (e.target).getAttribute('id').replace('actionEdit','');
    editActionId = editId;
    actionObj.map( (item, index) => {
        if(item.actionId == editId){
            $('#actionInput').val(capitalize(item.text));
        }
    });
}

$('#editAction').click ( () => {
    if($('#actionInput').val() != '' && ($('#actionInput').val().replace(/\s/g, '').length)){
        $('#action'+editActionId).text($('#actionInput').val());
        actionObj.map( (item, index) => {
            if(item.actionId == editActionId){
                item.text = $('#actionInput').val()
            }
        });
        $('#actionInput').val('');
        $('#editAction').addClass('d-none');
        $('#addAction').removeClass('d-none');
    }
    else{
        toastr.error('Please fill proper input field');
    }
})

let actionUpdatedList = () => {
    actions = [];
    $('.actionList').each((i, obj) => {
        let id = (obj.firstElementChild.firstElementChild.getAttribute('id')).replace('action','')
        actions.push(actionArray(current_url.includes('edit=') ? id : isProduction ? null : id, obj.firstElementChild.firstElementChild.textContent, obj.classList.contains('disableDiv')));
    });
    return actions;
}

let KPIUpdatedList = () => {

    measurements = [];
    measurement = {};
    $('.KPIdes').each((i, obj) => {
        let type, date = '';
        if(obj.lastElementChild.children[1].textContent != ''){
            type = 'number'
        }
        else{
            type = 'flag'
        }
        date = obj.lastElementChild.children[0].textContent == 'undefined' ? '' : Date.parse(new Date(obj.lastElementChild.children[0].textContent.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")));
        let id = obj.firstElementChild.firstElementChild.getAttribute('id').replace('KPIDesc', '');
        measurements.push(measurementArray(current_url.includes('edit=') ? id : isProduction ? null : id, obj.firstElementChild.firstElementChild.textContent, type, obj.lastElementChild.children[1].textContent, date, obj.classList.contains('disableDiv')));
    });
    return measurements;
}

/** End:: Edit Actions */
let goalDetailList = () => {
    let newGoalData = {
        'department': $("#setDept option:selected").text(),
        'departmentId': $("#setDept option:selected").val(),
        "goal": {
            'goalId': current_url.includes('edit=') ? parseInt($('#goalDes').attr('goalId'))+0 : isProduction ? null :  Math.floor(Math.random() * 1000) + 1,
            'description': $('#goalDes').val(),
            'parentGoalId': ($("#selectGoal option:selected").val() != 'parentGoal' ? parseInt($("#selectGoal option:selected").val()) : 0),
        },
        'measurements': KPIUpdatedList(),
        "actions": actionUpdatedList(),
        "children": []
    }
    return newGoalData;
}

$('#newGoal').click( () => {
    if(($('#goalDes').val() == '' ) || ($('#setDept').val() == 'createDep') || (!$('#goalDes').val().replace(/\s/g, '').length)){
        toastr.info('Please add required field');
    }
    else{
        let addGoal = (result) => {
            window.location = 'dashboard.html';
        }
        let newGoal = async() => {
            try{
                if(current_url.includes('edit=')){
                    const goalDetail = await api.editGoal(goalDetailList(), $("#setDept option:selected").val(), $("#selectGoal option:selected").val());
                    addGoal(goalDetail);
                }
                else{
                    const goalDetail = await api.addNewGoal(goalDetailList(), $("#setDept option:selected").val(), $("#selectGoal option:selected").val());
                    addGoal(goalDetail);
                }
            } catch(e) {
                console.log(e)
                toastr.error("Enable to Add goal");
            }
        }
        newGoal();
    }
})

$('#selectMetric').change( () => {
    if($("#selectMetric option:selected" ).val() == 'number'){
        $('#targetNumber').parent('div').removeClass('d-none');
    }
    else{
        $('#targetNumber').parent('div').addClass('d-none');
    }
})
