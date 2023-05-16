
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { Input } from '@progress/kendo-react-inputs';
import moment from 'moment';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import filterIcon from '../../assets/images/filter.png';
import searchIcon from '../../assets/images/search.png';
import InputKendoRct from "../../control-components/input/input";
import { showError } from '../../util/utility';
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'

const MessageSearchView = forwardRef((props, ref) => {

    const {
        search, setSearch,
        clearAdvSearchObj, advSearchFields, setAdvSearchFields,
        advSearchActive, setAdvSearchActive,
        setDisplaySearchResult,
        getMessagesList, orgStaffList,
        drawerState, labelState,
        setPage, defaultPageSettings
    } = props
    const [staffList, setStaffList] = useState([]);
    const [showAdvSearch, setShowAdvSearch] = useState(false);
    const outsideRef = useRef(null);
    const [modelScroll, setScroll] = useModelScroll()

    /* ============================= Private functions ============================= */

    useImperativeHandle(ref, () => ({
        reset() {
            handleClearFilter()
        }
    }));

    /* ============================= useEffects ============================= */

    useEffect(() => {
        setStaffList(orgStaffList)
    }, [orgStaffList])

    /* ============================= Event functions ============================= */

    function onStaffFilterChange(event) {
        const searchValue = event.filter.value.toLowerCase()
        if (searchValue.length == 0) {
            setStaffList(orgStaffList)
        } else {
            setStaffList(orgStaffList.filter(
                staff => staff.name.toLowerCase().includes(searchValue)))
        }
    }

    function onSearch(event) {
        let searchValue = event.value

        if (advSearchActive) {
            handleClearFilter()
            if (searchValue.length == search.length - 1)
                searchValue = ""
            else
                searchValue = event.value[event.value.length - 1]
        }

        setSearch(searchValue)
        setDisplaySearchResult(event.value.length > 2)
        if (event.value.length > 2) {
            getMessagesList(drawerState, labelState)
        }
    }

    function handleAdvSearchView() {
        setShowAdvSearch(x => !x)
    }

    const handleChange = (e) => {
        const name = e.target.name;
        let value = e.target.value;

        if (value == "" && (name === "fromStaffId" || name === "fromUtcDate" || name === "toUtcDate")) {
            value = null
        }
        else if (name === "fromStaffId") {
            value = [value[value.length - 1]]
        }

        const newAdvSearchFileds = {
            ...advSearchFields,
            [name]: value,
        }
        setAdvSearchFields(newAdvSearchFileds)
    }

    const handleApplyFilter = () => {
        let search = ""
        if (advSearchFields.fromStaffId != null) {
            search += `From:${advSearchFields.fromStaffId[0].name} `
        }
        if (advSearchFields.body != "") {
            search += `Body:${advSearchFields.body} `
        }
        if (advSearchFields.subject != "") {
            search += `Subject:${advSearchFields.subject} `
        }
        if (advSearchFields.fromUtcDate != null) {
            if (advSearchFields.toUtcDate != null && advSearchFields.fromUtcDate > advSearchFields.toUtcDate) {
                showError("'From' date can't be greater than 'To' date")
                return
            }
            search += `After:${moment(advSearchFields.fromUtcDate).format("MM/DD/yyyy")} `
        }
        if (advSearchFields.toUtcDate != null) {
            search += `Before:${moment(advSearchFields.toUtcDate).format("MM/DD/yyyy")} `
        }
        if (search == "") {
            return
        }
        setSearch(search)
        setShowAdvSearch(false)
        setAdvSearchActive(true)
        setDisplaySearchResult(true)
        setPage(defaultPageSettings)
        getMessagesList(drawerState, labelState, undefined, undefined, true)
    }

    const handleClearFilter = () => {
        setSearch("")
        setShowAdvSearch(false)
        setAdvSearchFields(clearAdvSearchObj)
        setAdvSearchActive(false)
        setDisplaySearchResult(false)
        setPage(defaultPageSettings)
        getMessagesList(drawerState, labelState, undefined, undefined, false)
    }

    /* ============================= Render View ============================= */

    function renderAdvSearchFrom(li, itemProps) {
        const itemChildren = (
            <span>
                {li.props.children}
            </span>
        );
        return React.cloneElement(li, li.props, itemChildren);
    }

    return (
        <div className="content-search-filter  px-0 filter-drop-down" ref={outsideRef}>
            <img src={searchIcon} alt="" className="search-icon" />
            <Input className="icon-searchinput"
                placeholder="Type min. 3 chars for search..."
                value={search}
                onChange={onSearch}
            />
            <span onClick={handleAdvSearchView} className="dropdown-toggle"
                type="button" id="dropdownMenuButton"
                aria-haspopup="true" aria-expanded={showAdvSearch}>
                <img src={filterIcon} alt="" className="filter-search" />
            </span>
            <div className={showAdvSearch
                ? "dropdown-menu filter-popup dropdown-filter-menu show"
                : "dropdown-menu filter-popup dropdown-filter-menu"}
                aria-labelledby="dropdownMenuButton">
                <div className='current-popup'>
                    <form>
                        <div className='form-group  mb-1 align-items-center'>
                            <MultiSelect
                                validityStyles={false}
                                value={advSearchFields.fromStaffId}
                                onChange={handleChange}
                                name="fromStaffId"
                                label="From"
                                data={staffList}
                                textField="name"
                                itemRender={renderAdvSearchFrom}
                                filterable={true}
                                onFilterChange={onStaffFilterChange}
                            />
                        </div>
                        <div className='form-group mb-1 align-items-center'>
                            <InputKendoRct
                                validityStyles={false}
                                value={advSearchFields.subject}
                                onChange={handleChange}
                                name="subject"
                                label="Subject"
                            />
                        </div>
                        <div className='form-group mb-1 align-items-center'>
                            <InputKendoRct
                                validityStyles={false}
                                value={advSearchFields.body}
                                onChange={handleChange}
                                name="body"
                                label="Body"
                            />
                        </div>
                        <div className='form-group mb-1 align-items-center'>
                            <DatePicker
                                validityStyles={false}
                                value={advSearchFields.fromUtcDate}
                                onChange={handleChange}
                                name="fromUtcDate"
                                label="From Date"
                            />
                        </div>
                        <div className='form-group mb-1 align-items-center'>
                            <DatePicker
                                validityStyles={false}
                                value={advSearchFields.toUtcDate}
                                onChange={handleChange}
                                name="toUtcDate"
                                label="To Date"
                            />
                        </div>
                        <div className="d-flex">
                            <div>
                                <button type='button' className='btn grey-secondary m-2'
                                    onClick={handleClearFilter}>
                                    Clear
                                </button>
                            </div>
                            <div>
                                <button type='button' className='btn blue-primary m-2'
                                    onClick={handleApplyFilter}>
                                    Filter
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
})

export default MessageSearchView;
