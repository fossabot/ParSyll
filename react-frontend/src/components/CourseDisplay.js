import React, { useEffect, useState, useRef, useContext } from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ProfessorCard from "./coursePage/ProfessorCard";
import TaCard from "./coursePage/TaCard";
import ClassHourCard from "./coursePage/ClassHourCard";
import LocationCard from "./coursePage/LocationCard";
import parseApp from "../api/Axios";
import { AuthContext } from "../hooks/useAuth";
import loadingRunner from '../assets/slither_1.gif'
import { Modal } from "@mui/material";
import PdfViewer from "./pdfUpload/PdfViewer";

import { useNavigate } from "react-router-dom";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  overflow:'scroll',
  boxShadow: 24,
  p: 4,
};


const CourseDisplay = ({course, hasBeenEdited, setHasBeenEdited}) => {
    const [viewPdf, setViewPdf] = useState(false)
    const [pdfFile, setPdfFile] = useState("")
    let {user} = useContext(AuthContext);
    let uid = user.uid
    let navigate = useNavigate()

    const handleDownloadIcsFile = (e) => {
        let fileBody = course.ics_file.join('')
        e.preventDefault()
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileBody));
        element.setAttribute('download', course.name + ".ics");
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }

    const handleDeleteCourse = (e) => {
        e.preventDefault()
        parseApp.delete(`/courses/${uid}/${course.id}`)
        .then ((res) => {
            setHasBeenEdited(!hasBeenEdited)
            console.log(res);
        })
    }

    const handleGetSyllabus = (e) => {
        e.preventDefault()
        parseApp.get(`/pdfs/${uid}/${course.syllabus}`)
        .then((res) => {
            console.log(res.data)
            setViewPdf(true)
            setPdfFile(res.data)
        })

    }

    // Sort days of week
    let dayDic = {
        "Monday" : 0,
        "Tuesday": 1,
        "Wednesday": 2,
        "Thursday": 3,
        "Friday" : 4,
        "Saturday" : 5,
        "Sunday" : 6,
    }

    if(course && course.days_of_week) {
        course.days_of_week.sort((a, b) => dayDic[a] - dayDic[b]);
    }

    return (
        <div className=" flex align-middle justify-center mt-6 pl-3 w-11/12">
        {course ? 
            <div className="align-middle w-10/12">
                <h1 className=" text-5xl text-center font-bold">{course.name}</h1>
                {/* <ProfessorCard professor={course.instructors} /> */}
                
                <h1 className=" pl-3 pt-4 text-3xl font-bold">Location: </h1>
                    {course.locations.map( (location, index) => (
                        <LocationCard key={index} location={location} index={index}/>
                    ))}
                <h1 className=" pl-3 pt-4 text-3xl font-bold">Instructors:</h1>
                <div className={`grid grid-cols-${Math.min(course.instructors.length, 3)} p-4 mt-6"`}>
                    {course.instructors.map( (instructor, index) => (
                        <TaCard key={index} instructor={instructor} index={index}/>
                    ))}
                </div>

                <h1 className=" pl-3 pt-4 text-3xl font-bold">Lecture times: </h1>
                <div className={`grid grid-cols-${Math.min(course.days_of_week.length, 3)} p-4`}>
                    {course.days_of_week.map( (weekday, index) => (
                        <ClassHourCard weekday={weekday} startTime={course.class_start} endTime={course.class_end} key={index} index={index}/>
                    ))}
                </div>

                <h1 className=" pl-3 pt-4 text-3xl font-bold mb-10">Textbook: {course.textbook}</h1>
                <div className="flex flex-row justify-around align-middle">
                    <Button variant="outlined" color="secondary" onClick={handleDownloadIcsFile}>Download ICS</Button>
                    <Button variant="outlined">
                        <a href={`http://localhost:8000/pdfs/${uid}/${course.syllabus}`} download="myFile">Download File</a>
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleDeleteCourse}>Delete Course</Button>
                </div>
                {viewPdf ? 
                    <div>
                        <Button hidden>View PDF</Button>
                        <Modal
                            style={{overflow:"scroll"}}
                            disableEnforceFocus
                            open={viewPdf}
                            onClose={() => setViewPdf(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <PdfViewer pdfFile={pdfFile} handleSendPdf={handleDownloadIcsFile} loading={false} />
                            </Box>
                        </Modal>
                    </div>
                    :""
                }
            </div>
            : 
            <div className=" flex flex-col align-middle p-5">
                <h1 className=" text-5xl text-center font-bold mb-10">Wow, such empty</h1>
                <img src={loadingRunner} alt="loading..." className="mb-10"/>
                <Button variant="contained" color="primary" size="large" onClick={() => navigate("/dashboard/upload_pdf")}> 
                    Parse PDF
                </Button>
            </div>
        }
        </div>
    )

}

export default CourseDisplay