import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { setCompletedLectures } from "../../../slices/viewCourseSlice";
import { BiSkipPreviousCircle, BiSkipNextCircle } from "react-icons/bi";
import { MdOutlineReplayCircleFilled } from "react-icons/md";

const VideoDetails = () => {
  const { courseId, sectionId, subsectionId } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { courseSectionData, completedLectures } = useSelector(
    (state) => state.viewCourse
  );
  const navigate = useNavigate();

  const [lectureData, setLectureData] = useState(null);

  useEffect(() => {
    if (courseSectionData.length === 0) {
      return;
    }

    const filteredSection = courseSectionData.find(
      (section) => section._id === sectionId
    );
    const filteredSubsection = filteredSection?.subSection.find(
      (subsection) => subsection._id === subsectionId
    );

    setLectureData(filteredSubsection);

    // Debugging Log
    console.log("Lecture Data:", filteredSubsection);
  }, [courseSectionData, sectionId, subsectionId]);

  const handleLectureCompletion = async () => {
    if (!completedLectures.includes(lectureData._id)) {
      await markLectureAsComplete(
        {
          userId: user._id,
          courseId: courseId,
          subSectionId: subsectionId,
        },
        token
      );
      dispatch(setCompletedLectures([...completedLectures, lectureData._id]));
    }
  };

  const isLastLecture = () => {
    const currentSectionIndex = courseSectionData?.findIndex(
      (section) => section._id === sectionId
    );
    const currentSubsectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSection.findIndex((subsection) => subsection._id === subsectionId);

    return (
      currentSubsectionIndex ===
        courseSectionData[currentSectionIndex]?.subSection.length - 1 &&
      currentSectionIndex === courseSectionData.length - 1
    );
  };

  const isFirstLecture = () => {
    const currentSectionIndex = courseSectionData?.findIndex(
      (section) => section._id === sectionId
    );
    const currentSubsectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSection.findIndex((subsection) => subsection._id === subsectionId);

    return currentSubsectionIndex === 0 && currentSectionIndex === 0;
  };

  const nextLecture = () => {
    if (isLastLecture()) {
      return;
    }

    const currentSectionIndex = courseSectionData?.findIndex(
      (section) => section._id === sectionId
    );
    const currentSubsectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSection.findIndex((subsection) => subsection._id === subsectionId);

    if (
      currentSubsectionIndex ===
      courseSectionData[currentSectionIndex]?.subSection.length - 1
    ) {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]?._id;
      const nextSubsectionId =
        courseSectionData[currentSectionIndex + 1]?.subSection[0]._id;

      navigate(
        `/dashboard/enrolled-courses/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubsectionId}`
      );
    } else {
      const nextSectionId = courseSectionData[currentSectionIndex]._id;
      const nextSubsectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSubsectionIndex + 1
        ]._id;

      navigate(
        `/dashboard/enrolled-courses/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubsectionId}`
      );
    }
  };

  const previousLecture = () => {
    if (isFirstLecture()) {
      return;
    }

    const currentSectionIndex = courseSectionData?.findIndex(
      (section) => section._id === sectionId
    );
    const currentSubsectionIndex = courseSectionData[
      currentSectionIndex
    ]?.subSection.findIndex((subsection) => subsection._id === subsectionId);

    if (currentSubsectionIndex === 0) {
      const previousSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const previousSubsectionId =
        courseSectionData[currentSectionIndex - 1]?.subSection[
          courseSectionData[currentSectionIndex - 1].subSection.length - 1
        ]._id;

      navigate(
        `/dashboard/enrolled-courses/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubsectionId}`
      );
    } else {
      const previousSectionId = courseSectionData[currentSectionIndex]?._id;
      const previousSubsectionId =
        courseSectionData[currentSectionIndex]?.subSection[
          currentSubsectionIndex - 1
        ]._id;

      navigate(
        `/dashboard/enrolled-courses/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubsectionId}`
      );
    }
  };

  if (!lectureData) return <div>Loading...</div>;

  console.log(lectureData.videoUrl);

  return (
    <div className="md:w-[calc(100vw-320px)] w-screen p-3">
      <div>
        {lectureData?.videoUrl ? (
          <div>
            {/* Display the PDF using an iframe */}
            <iframe
              src={lectureData.videoUrl}
              title="Lecture PDF"
              width="100%"
              height="600px"
              className="border rounded-lg"
            ></iframe>
          </div>
        ) : (
          <p className="text-center bg-white">PDF not available for this lecture.</p>
        )}
      </div>

      <div className="mt-5">
        <h1 className="text-2xl font-bold text-richblack-25">
          {lectureData?.title}
        </h1>
        <p className="text-gray-500 text-richblack-100">
          {lectureData?.description}
        </p>
      </div>

      <div className="mt-5 flex justify-between">
        {!isFirstLecture() && (
          <BiSkipPreviousCircle
            onClick={previousLecture}
            className="text-2xl md:text-5xl bg-richblack-600 rounded-full cursor-pointer hover:scale-90"
          />
        )}
        {!isLastLecture() && (
          <BiSkipNextCircle
            onClick={nextLecture}
            className="text-2xl md:text-5xl bg-richblack-600 rounded-full cursor-pointer hover:scale-90"
          />
        )}
        <MdOutlineReplayCircleFilled
          onClick={() => window.location.reload()}
          className="text-2xl md:text-5xl bg-richblack-600 rounded-full cursor-pointer hover:scale-90"
        />
      </div>
    </div>
  );
};

export default VideoDetails;
