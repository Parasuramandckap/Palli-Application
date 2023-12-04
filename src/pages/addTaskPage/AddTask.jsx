import React, { useEffect, useState } from "react";
import { useNavigate ,useParams} from "react-router-dom";

//external packages
import {
  notification,
  DatePicker,
  Select,
  Skeleton,
  Menu,
  Dropdown,
  Checkbox,
} from "antd";
import axios from "axios";
import moment from "moment";
//custom hook paste here
import useForm from "../../hooks/useForm";

//context paste here
import { useAuth } from "../../context/AuthContext";
//API endpoint here
import { API_END_POINT } from "../../../config";

//supporting utilits here
import { validateAddTask } from "../../utils/validate";
//css here
import "./AddTask.css";
const AddTask = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { token } = useAuth();
  const { id: batchId } = useParams();
  const initialState = {
    task_title: "",
    task_description: "",
    due_date: "",
    task_type: 0,
  };
  const [studentList, setStudentList] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [loading,setLoading] = useState(false)
  const { formData, errors, setErrors, handleChange, resetForm, setFormData } =
    useForm(initialState);

  const handleDate = (date, dataString) => {
    handleChange({ target: { name: "due_date", value: dataString } });
  };

  const handleType = (taskType) => {
    handleChange({
      target: { name: "task_type", value: taskType === "task" ? 0 : 1 },
    });
  };
  useEffect(() => {
    setLoading(true)

    const headers = {
      Authorization: `Bearer ${token.access}`,
    };

    // Initialize variables for task details and student list requests
    let fetchTaskDetails;
    const fetchStudentList = axios.get(
      `${API_END_POINT}/api/applicant/${batchId}/list/students/`,
      { headers }
    );

    // Conditionally fetch task details if taskId is truthy
    if (taskId) {
      fetchTaskDetails = axios.get(
        `${API_END_POINT}/api/task/${batchId}/get/task/${taskId}`,
        { headers }
      );
    }

    Promise.all([fetchTaskDetails, fetchStudentList])
      .then(([taskDetailsRes, studentListRes]) => {
        setLoading(true)
        const taskDetails = taskDetailsRes ? taskDetailsRes.data.data : null;
        const studentList = studentListRes.data
          ? studentListRes?.data?.data
          : [];
        setStudentList(studentList);
        setSelectedStudents(
          selectAll ? studentList.map((student) => student.id) : []
        );

        if (taskDetails) {
          const { task_title, task_description, due_date, task_type } =
            taskDetails;
          setFormData({
            task_title,
            task_description,
            task_type,
            due_date,
          });
        }
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      }).finally(()=>{
        setLoading(false)
      })
  }, [taskId, batchId, token, selectAll]);
  const handleSelectAllChange = (e) => {
    e.stopPropagation();
    setSelectAll(e.target.checked);
    setSelectedStudents(
      e.target.checked ? studentList.map((student) => student.id) : []
    );
  };

  const handleStudentSelect = (value) => {
    setSelectedStudents(value);
    setSelectAll(false);
  };
  const handleTaskAdd = async () => {
    const isVaild = validateAddTask(formData, setErrors);

    if (isVaild) {
      const apiEndpoint = taskId
        ? `${API_END_POINT}/api/task/${batchId}/update_task/${taskId}`
        : `${API_END_POINT}/api/task/${batchId}/create_task/`;

      const method = taskId ? "PUT" : "POST";
      try {
        await axios({
          method,
          url: apiEndpoint,
          headers: {
            Authorization: `Bearer ${token.access}`, // Include your authentication token
            "Content-Type": "application/json",
          },
          data: formData,
        });

        notification.success({
          message: "Success",
          description: taskId
            ? "Task Updated Successfully"
            : "Task Added Successfully",
          duration: 3,
        });

        navigate(`/batch/${batchId}/module`);

        resetForm();
      } catch (error) {
        console.error("Error:", error);
        // Handle error notification or other logic
      }
    }
  };

  const dropdownMenu = (
    <Menu>
      <Menu.Item key="selectAll">
        <Checkbox onChange={handleSelectAllChange} checked={selectAll}>
          Select All
        </Checkbox>
      </Menu.Item>

      <Menu.Divider />
      <Menu.Item key="students">
        <Select
          mode="multiple"
          placeholder="Select students"
          style={{ minWidth: "200px" }}
          value={
            selectAll
              ? studentList.map((student) => student.id)
              : selectedStudents
          }
          onChange={handleStudentSelect}
        >
          {studentList && [
            ...studentList.map((student) => (
              <Select.Option key={student.id} value={student.id}>
                {`${student.first_name} ${student.last_name}`}
              </Select.Option>
            )),
          ]}
        </Select>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="content">
      {loading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <>
          <div className="task-add-page">
            <main className="container">
              <div className="inner-container">
                <div className="left-container">
                  <div className="page-logo">
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                    <span className="task-txt">Module</span>
                  </div>
                  <div className="task-name-sec">
                    <label htmlFor="task name">Title</label>
                    <input
                      placeholder="Title"
                      name="task_title"
                      value={formData.task_title}
                      onChange={handleChange}
                    />
                    <p className="error-message">
                      {errors.task_title ? errors.task_title : ""}
                    </p>
                  </div>
                  <div className="task-desc-sec">
                    <label htmlFor="task description">Description</label>
                    <textarea
                      rows={4}
                      name="task_description"
                      placeholder="Description"
                      value={formData.task_description}
                      onChange={handleChange}
                    />
                    <p className="error-message">
                      {errors.task_description ? errors.task_description : ""}
                    </p>
                  </div>
                </div>
                <div className="right-container">
                  <div className="right-contents">
                    <div className="students">
                      <label htmlFor="students">Students</label>
                      <Dropdown
                        overlay={dropdownMenu}
                        trigger={["click"]}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          className="ant-dropdown-link"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          {studentList.length === selectedStudents.length
                            ? "All Students Selected"
                            : `${
                                selectedStudents.length === 0
                                  ? "Select students"
                                  : `${selectedStudents.length} Selected`
                              }`}
                        </a>
                      </Dropdown>
                      <p className="error-message">
                      </p>
                    </div>
                    <div className="due-date-sec">
                      <label htmlFor="due">Due Date</label>

                      <DatePicker
                        showTime="true"
                        format="YYYY-MM-DDTHH:mm:ss"
                        placeholder="Select Date and Time"
                        name="due_date"
                        value={taskId && moment(formData.due_date)}
                        onChange={handleDate}
                      />

                      <p className="error-message">
                        {errors.due_date ? errors.due_date : ""}
                      </p>
                    </div>
                    <div className="due-date-sec">
                      <label htmlFor="due">Task Type</label>
                      <Select
                        name="task_type"
                        value={formData.task_type === 0 ? "task" : "assessment"}
                        style={{
                          width: 120,
                        }}
                        placeholder="Select a person"
                        onChange={handleType}
                        options={[
                          {
                            value: "task",
                            label: "Test",
                          },
                          {
                            value: "assessment",
                            label: "Assessment",
                          },
                        ]}
                      />
                      <p className="error-message">
                        {errors.task_type ? errors.task_type : ""}
                      </p>
                    </div>
                    <div className="weightage">
                      <label htmlFor="">Weightage</label>
                      <button>
                        <a href={`/batch/${batchId}/module/add/task/weightage`}>
                          Weightage
                        </a>
                      </button>
                    </div>
                  </div>
                  <div className="btns-div">
                    <button className="cancel-btn" onClick={() => resetForm()}>
                      CANCEL
                    </button>
                    <button className="assign-btn" onClick={handleTaskAdd}>
                      {taskId ? "UPDATE" : "ASSIGN"}
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default AddTask;
