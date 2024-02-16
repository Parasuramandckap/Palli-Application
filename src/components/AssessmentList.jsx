import React from "react";

import { Skeleton } from "antd";

import dayjs from "dayjs";

import { getPermission } from "../utils/validate";


import { useAuth } from "../context/AuthContext";


const TaskCard = ({
  loading,
  assessment,
  selectedAssessment,
  handleEdit,
  handleDelete,
  setIsStudentScoreOpen,
  isMode,
  setIsMode,
  currentAssessment
}) => {
  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };
  const {user} = useAuth();
  return (
    <>
      <div
        className={`task-card ${
          assessment.id === selectedAssessment ? "active" : ""
        } flex`}
        key={assessment.id}
        id={assessment.id}
        onClick={() => {
          if(currentAssessment.draft){
            setIsStudentScoreOpen(false)
            handleEdit(assessment.id);
            setIsMode("edit")
          }else{
          setIsStudentScoreOpen(true)
          handleEdit(assessment.id);
          setIsMode("card")
        }
        }}
      >
        {loading ? (
          <Skeleton avatar={{ size: "small" }} active paragraph={{ rows: 1 }} />
        ) : (
          <>
            <div className="task-icon flex">
              <span>JS</span>
            </div>

            <div className="task-details">
              <div className="task-name-with-icon flex">
                <h2>{truncateText(assessment.task_title, 15)}</h2>
                <>
                    {getPermission(user.permissions, "Task", "update") && (
                  <img
                        src={selectedAssessment === assessment.id && isMode == "edit" ? "/icons/edit-pencil-fill.svg" : "/icons/edit-pencil.svg"}
                        className="edit-icon"
                        alt="edit-icon"
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsStudentScoreOpen(false)
                          handleEdit(assessment.id);
                          setIsMode("edit")
                        }}
                      />
                    )}

                  {getPermission(user.permissions,"Task","delete") && (
                     <img
                     src="/icons/deleteIcon.svg"
                     alt="delete-icon"
                     className="delete-icon"
                     id={assessment.id}
                     onClick={(e) => {
                       handleDelete(assessment.id);
                       e.stopPropagation();
                     }}
                   />
                  )}
                 
                </>
              </div>
              <p className="task-description">
                {truncateText(
                  assessment.task_description.replace(/<[^>]*>/g, ""),
                  60
                )}
              </p>
              <span className="btn btn-deadline">
                {dayjs(assessment.due_date).format("MMM,DD YYYY")}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const AssessmentList = ({
  mode,
  filterShow,
  handleEdit,
  assessmentList,
  setAssessmentSearchWord,
  loading,
  handleDelete,
  handleAdd,
  selectedAssessment,
  isStudentScoreOpen,
  setIsStudentScoreOpen,
  isMode,
  setIsMode,
  currentAssessment
}) => {
  const { user } = useAuth();

  return (
    <>
      <section className="listing-container">
        <h1>{mode} list</h1>
        <div className="search-container">
          <input
            type="input"
            placeholder="search..."
            onChange={(e) => setAssessmentSearchWord(e.target.value)}
          />{" "}
          <img
            src="/icons/searchIcon.svg"
            alt="search-icon"
            className="search-icon"
          />
          {filterShow && (
            <img
              src="/icons/filterIcon.svg"
              alt="filter-icon"
              className="filter-icon"
            />
          )}
        </div>
        <div className="create-container">
          {getPermission(user.permissions, "Task", "create") && (
           !loading && (
            <button className="btn create-btn" onClick={handleAdd}>
              <span>+</span>Create {mode}
            </button>
           )

          )}

        </div>
        <div className="task-list-container">
          {assessmentList &&
            assessmentList.map((assessment) => (
              <TaskCard
                key={assessment.id}
                loading={loading}
                assessment={assessment}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                selectedAssessment={selectedAssessment}
                setIsStudentScoreOpen={setIsStudentScoreOpen}
                isStudentScoreOpen={isStudentScoreOpen}
                isMode={isMode}
                setIsMode={setIsMode}
                currentAssessment={currentAssessment}
              />
            ))}
        </div>
      </section>
    </>
  );
};

export default AssessmentList;
