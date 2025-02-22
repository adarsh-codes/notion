import React, { useState } from 'react';
import { HomePageExplore } from '../../../data/homepage-explore';
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsName = [
  "Computer Science & IT",
  "Mechanical Engineering",
  "IT Skills",
  "PYQ College Exams",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.find((course) => course.tag === value);
    setCourses(result.courses);
    setCurrentCard(result.courses[0].heading);
  };

  return (
    <div>
      <div className="text-3xl font-semibold text-center lg:text-4xl">
        Learn from
        <HighlightText text={"the best materials available over the internet"} />
      </div>

      <p className="text-center text-richblack-300 text-sm text-[16px] mt-3">
        Learn to build anything you can imagine
      </p>

      <div className="mt-5 flex flex-row rounded-full bg-richblack-800 mb-3 border-richblack-100 px-1 py-1">
        {tabsName.map((element, index) => {
          return (
            <div
              className={`text-[13px] lg:text-[16px] flex flex-row items-center gap-2 ${
                currentTab === element
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              } rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 text-center px-3 py-1 lg:px-7 lg:py-2`}
              key={index}
              onClick={() => setMyCards(element)}
            >
              {element}
            </div>
          );
        })}
      </div>

      <div className="flex gap-9 w-full justify-center mt-5 flex-wrap lg:absolute right-0 left-0 mr-auto ml-auto">
        {courses.map((element, index) => {
          return (
            <CourseCard
              key={index}
              cardData={element}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMore;
