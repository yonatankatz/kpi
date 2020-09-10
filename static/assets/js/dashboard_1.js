$('#navbarToggle').click( () => {
    if($('#navbarToggle>img').attr('src') == 'assets/image/arrow large.svg')
        $('#navbarToggle>img').attr('src', 'assets/image/arrow right.svg');
    else
        $('#navbarToggle>img').attr('src', 'assets/image/arrow large.svg');
})

$('#changeView').click( () => {
    if($('#changeView>img').attr('src') == 'assets/image/list icon.svg'){
        $('#changeView>img').attr('src', 'assets/image/grid icon.svg');
        $('#changeView>span').text('Change to Grid View');
        $('#gridView').addClass('d-none');
        $('#listView').removeClass('d-none');
    }
    else{
        $('#changeView>img').attr('src', 'assets/image/list icon.svg');
        $('#changeView>span').text('Change to List View');
        $('#listView').addClass('d-none');
        $('#gridView').removeClass('d-none');
    }
})



let setDepartment = (result) => {
    if(result && result.children && result.children.length){
        let department = document.querySelector('#department');
        result.children.map( (item, index) => {
            department.appendChild(departmentList(index, item.name));
        });
    }
}

window.onload = async() => {
    try{
        const company = await API(COMPANY_API, '', 'GET');
        setDepartment(company);
    } catch(e) {
        toastr.error("Enable to get departments");
    }
}

let listViewChildren = (result, id, i) => {
    localStorage.setItem('getChildKPI', JSON.stringify(result.goal));
    $(id).append('<li class="no-border pt-4">GOAL #'+(i+1)+'</li>\
                                            <li>\
                                                <div class="d-md-flex p-3 border_light rounded_5 bg-white">\
                                                    <div class="mr-auto img_center" type="button" data-toggle="collapse" data-target="#collapseList'+i+'" aria-expanded="false" aria-controls="collapseExample1" id="listViewToggle">\
                                                        <img src="assets/image/arrow large.svg" alt="">\
                                                        <span class="pl-2 line_height" id="KPIChild'+result.goal.goalId+'">'+capitalize(result.goal.description)+'</span>\
                                                    </div>\
                                                    <div class="d-flex content-end">\
                                                        <button class="buttonBg" onclick="editChildKPI(this)">\
                                                            <img src="assets/image/pencil icon.svg" alt="">\
                                                        </button>\
                                                        <button class="buttonBg" id="delete'+result.goal.goalId+'" onclick="removeChildKPI(this)">\
                                                            <img src="assets/image/trash icon.svg" alt="">\
                                                        </button>\
                                                    </div>\
                                                </div>\
                                            <ul id="collapseList'+i+'" class="collapse pl-3">\
                                            <ul></li>');

            result.measurements.map( (item, index) => {
                if(index == 0){
                    $('#collapseList'+i).append('<li class="no-border pt-4">KPIS</li>');
                }
                $('#collapseList'+i).append('<li>\
                                        <div class="d-md-flex p-3 border_light rounded_5 border_left bg-white position-relative align_center">\
                                            <div class="mr-auto">\
                                                <p class="mb-0 p-2 line_height">'+capitalize(item.description)+'</p>\
                                            </div>\
                                            '+( item.type == "flag" ?
                                            '<div class="d-flex content-end">\
                                                <p class="bg_orange_light text-white rounded-pill mb-0 p-2 text-center width-10 font_light line_height">Due '+ milliseconds(item.dueDate) +'</p>\
                                            </div>\
                                            ':'')+
                                        '</div>\
                                    </li>');
            })

        result.actions.map( (item, index) => {
            if(index == 0){
                $('#collapseList'+i).append('<li class="no-border pt-4">ACTION ITEMS</li>');
            }
            $('#collapseList'+i).append('<li>\
                                    <div class="d-md-flex p-3 border_light rounded_5 border_left1 bg-white align_center">\
                                        <div class="mr-auto">\
                                            <p class="mb-0 p-2 line_height">'+capitalize(item.text)+'</p>\
                                        </div>\
                                    </div>\
                                </li>');
        });

        if(result.children){
            console.log(i);
            listViewChildren(result.children, '#collapseList'+i, i+1);
            console.log(i+1)
        }
        else{
            return;
        }
}

let setGoal = (result) => {
    if(result && result.goal){
        localStorage.setItem('getKPI', JSON.stringify(result.goal));
        $('#listViewStructure').append('<li class="no-border pt-2 border-0 pl-0">GOAL #1</li>\
                                            <li class="no-border pl-0 border-0">\
                                                <div class="d-md-flex p-3 border_light rounded_5 bg-white">\
                                                    <div class="mr-auto img_center" type="button" data-toggle="collapse" data-target="#collapseList" aria-expanded="false" aria-controls="collapseExample1" id="listViewToggle">\
                                                        <img src="assets/image/arrow large.svg" alt="">\
                                                        <span class="pl-2 line_height" id="KPI'+result.goal.goalId+'">'+capitalize(result.goal.description)+'</span>\
                                                    </div>\
                                                    <div class="d-flex content-end">\
                                                        <button class="buttonBg" onclick="editKPI(this)">\
                                                            <img src="assets/image/pencil icon.svg" alt="">\
                                                        </button>\
                                                        <button class="buttonBg" id="delete'+result.goal.goalId+'" onclick="removeKPI(this)">\
                                                            <img src="assets/image/trash icon.svg" alt="">\
                                                        </button>\
                                                    </div>\
                                                </div>\
                                            </li>\
                                            <ul id="collapseList" class="collapse show pl-3">\
                                            <ul>');
        result.measurements.map( (item, index) => {
            if(index == 0){
                $('#collapseList').append('<li class="no-border pt-4">KPIS</li>');
            }
            $('#collapseList').append('<li>\
                                    <div class="d-md-flex p-3 border_light rounded_5 border_left bg-white position-relative align_center">\
                                        <div class="mr-auto">\
                                            <p class="mb-0 p-2 line_height">'+capitalize(item.description)+'</p>\
                                        </div>\
                                        '+( item.type == "flag" ?
                                        '<div class="d-flex content-end">\
                                            <p class="bg_orange_light text-white rounded-pill mb-0 p-2 text-center width-10 font_light">Due '+ milliseconds(item.dueDate) +'</p>\
                                        </div>\
                                        ':'')+
                                    '</div>\
                                </li>');

            $('#gridView').append('<div class="col-md-6 py-4">\
                                        <div class="box_shadow_light rounded_5">\
                                            <div class="p-2 bg-dark border_top">\
                                                <p class="text-center text-white mb-0">Goal: '+result.goal.description+'</p>\
                                            </div>\
                                            <div class="p-3 bg-white border_bottom">\
                                                <p class="text-center">'+item.description+'</p>\
                                                <canvas id="doughnut'+index+'"></canvas>\
                                            </div>\
                                        </div>\
                                    </div>');
            chartUI('doughnut'+index, [100, 0], ['100% Complete', 'Current rate: 12%']);
        })
        result.actions.map( (item, index) => {
            if(index == 0){
                $('#collapseList').append('<li class="no-border pt-4">ACTION ITEMS</li>');
            }
            $('#collapseList').append('<li>\
                                    <div class="d-md-flex p-3 border_light rounded_5 border_left1 bg-white align_center">\
                                        <div class="mr-auto">\
                                            <p class="mb-0 p-2 line_height">'+capitalize(item.text)+'</p>\
                                        </div>\
                                    </div>\
                                </li>');
        });

        if(result.children){
            listViewChildren(result.children, '#collapseList', 1);
        }

        $('#listViewToggle').click( () => {
            if($('#listViewToggle>img').attr('src') == 'assets/image/arrow large.svg')
                $('#listViewToggle>img').attr('src', 'assets/image/arrow right.svg');
            else
                $('#listViewToggle>img').attr('src', 'assets/image/arrow large.svg');
        })
    }
    else{
        $('#listView').addClass('d-none');
        $('#gridView').addClass('d-none');
        $('#NotFound').removeClass('d-none');
    }

}

let goalDetail = async() => {
    try{
        const goal = await API(KPI_API+'?unit='+$("#setDept option:selected" ).val(), '', 'GET');
        setGoal(goal);
    } catch(e) {
        toastr.error("Enable to get Goal");
    }
}

$('#DeptForm input').on('change', () => {
    goalDetail();
})

goalDetail();

/** Start:: Delete KPI */
removeKPI = (elem) => {
    let remove = (result) => {
        $(elem).parent().parent().parent().parent().parent('div').remove();
    }
    let deleteKPI = async() => {
        try{
            const KPI = await API(KPI_API+'?measurementId='+($(elem).attr('id')).replace('delete',''), '', 'GET');
            remove(KPI);
        } catch(e) {
            toastr.error("Enable to delete KPI");
        }
    }
    deleteKPI();
}

removeChildKPI = (elem) => {
    let remove = (result) => {
        // $(elem).parent().parent().parent('li').remove();
        elem.offsetParent.previousElementSibling.remove()
        elem.offsetParent.remove();
    }
    let deleteKPI = async() => {
        try{
            const KPI = await API(KPI_API+'?measurementId='+($(elem).attr('id')).replace('delete',''), '', 'GET');
            remove(KPI);
        } catch(e) {
            toastr.error("Enable to delete KPI");
        }
    }
    deleteKPI();
}

/** End:: Delete KPI */


/** Start:: Edit KPI */

editKPI = (elem) => {
    $('#editKPI').modal('show');
    let detailKPI = JSON.parse(localStorage.getItem('getKPI'));
    $('#KPI').val(detailKPI.description);
}

editChildKPI = (elem) => {
    $('#editChildKPI').modal('show');
    let detailKPI = JSON.parse(localStorage.getItem('getChildKPI'));
    $('#KPI1').val(detailKPI.description);
}

$('#editGoal').click ( (e) => {
    e.preventDefault();
    let edit = () => {
        // console.log(JSON.parse(localStorage.getItem('getKPI')))
        let KPI_Id = JSON.parse(localStorage.getItem('getKPI'));
        $('#KPI'+KPI_Id.goalId).text(capitalize($('#KPI').val()));
        $('#AddKPIForm')[0].reset();
        $('#editKPI').modal('toggle');
        localStorage.removeItem('getKPI');
    }
    let goal = async() => {
        try{
            let goal = {
                "goalId": JSON.parse(localStorage.getItem('getKPI')).goalId,
                "description": $('#KPI').val(),
                "parentGoalId": JSON.parse(localStorage.getItem('getKPI')).parentGoalId
            }
            const KPI = await API(KPI_API, goal, 'GET');
            edit(KPI);
        } catch(e) {
            toastr.error("Enable to edit KPI");
        }
    }
    goal();
})

$('#editChildGoal').click ( (e) => {
    e.preventDefault();
    let edit = () => {
        // console.log(JSON.parse(localStorage.getItem('getKPI')))
        let KPI_Id = JSON.parse(localStorage.getItem('getChildKPI'));
        $('#KPIChild'+KPI_Id.goalId).text(capitalize($('#KPI1').val()));
        $('#AddChildKPIForm')[0].reset();
        $('#editChildKPI').modal('toggle');
        localStorage.removeItem('getChildKPI');
    }
    let childGoal = async() => {
        try{
            let goal = {
                "goalId": JSON.parse(localStorage.getItem('getChildKPI')).goalId,
                "description": $('#KPI1').val(),
                "parentGoalId": JSON.parse(localStorage.getItem('getChildKPI')).parentGoalId
            }
            const KPI = await API(KPI_API, goal, 'GET');
            edit(KPI);
        } catch(e) {
            toastr.error("Enable to edit KPI");
        }
    }
    childGoal();
})

/** End:: Edit KPI */