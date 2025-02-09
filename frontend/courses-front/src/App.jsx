import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [githubUsername, setGithubUsername] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/courses")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);

  const handleExpand = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      return;
    }

    fetch(`http://localhost:8000/courses/${courseId}`)
      .then((response) => response.json())
      .then((courseDetails) => {
        setExpandedCourse(courseId);
        setData((prevData) =>
          prevData.map((course) =>
            course.id === courseId ? { ...course, details: courseDetails } : course
          )
        );
      });
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourse(courseId);
    fetch(`http://localhost:8000/courses/${courseId}/groups`)
      .then((response) => response.json())
      .then((groupList) => {
        setGroups(groupList);
      });
  };

  const handleSelectGroup = (groupId) => {
    setSelectedGroup(groupId);
    fetch(`http://localhost:8000/courses/${selectedCourse}/groups/${groupId}/labs`)
      .then((response) => response.json())
      .then((labList) => {
        setLabs(labList);
      });
  };

  const handleSelectLab = (lab) => {
    setSelectedLab(lab);
  };

  const handleRegisterAndCheck = () => {
    fetch(`http://localhost:8000/courses/${selectedCourse}/groups/${selectedGroup}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        surname,
        name,
        patronymic,
        github: githubUsername,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
      })
      .catch((error) => {
        console.error("Ошибка регистрации:", error);
        alert("Ошибка регистрации, попробуйте снова.");
      });
  };

  return (
    <div>
      {selectedLab ? (
        <div>
          <h2>Запуск проверки</h2>
          <input
            type="text"
            placeholder="Фамилия"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Отчество"
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
          />
          <input
            type="text"
            placeholder="Введите GitHub никнейм"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
          />
          <button onClick={handleRegisterAndCheck}>Зарегистрироваться и запустить проверку</button>
        </div>
      ) : selectedGroup ? (
        <div>
          <h2>Лабораторные работы</h2>
          <ul>
            {labs.map((lab, index) => (
              <li key={index} onClick={() => handleSelectLab(lab)} style={{ cursor: "pointer" }}>
                {lab}
              </li>
            ))}
          </ul>
        </div>
      ) : selectedCourse ? (
        <div>
          <h2>Выберите группу</h2>
          <ul>
            {groups.map((group, index) => (
              <li key={index} onClick={() => handleSelectGroup(group)} style={{ cursor: "pointer" }}>
                {group}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        data.map((course) => (
          <div key={course.id}>
            <div>Название курса: {course.name}</div>
            <div>Семестр: {course.semester}</div>
            <button onClick={() => handleExpand(course.id)}>
              {expandedCourse === course.id ? "Скрыть" : "Подробнее"}
            </button>
            <button onClick={() => handleSelectCourse(course.id)}>Выбрать</button>
            {expandedCourse === course.id && course.details && (
              <div>
                <p>Email: {course.details.email}</p>
                <p>GitHub организация: {course.details["github-organization"]}</p>
                <p>Google Таблица: {course.details["google-spreadsheet"]}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
