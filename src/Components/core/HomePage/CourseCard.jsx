import { Link } from 'react-router-dom';

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  return (
    <div>
      <div
        className={`flex flex-col w-[360px] p-5 gap-1 ${
          currentCard === cardData.heading
            ? "bg-white text-richblack-700 shadow-[12px_12px_0px] shadow-[#FFD60A]"
            : "bg-richblack-700 text-richblue-100"
        }`}
        onClick={() => {
          setCurrentCard(cardData.heading);
        }}
      >
        <div className="flex flex-col text-center p-2 border-b-2 border-richblack-100 border-dashed">
          <Link
            to={cardData?.lnk}
            className={`text-xl font-bold text-left mb-2 ${
              currentCard === cardData.heading ? "text-black" : "text-richblue-5"
            }`}
            target="_blank" // Opens the link in a new tab
            rel="noopener noreferrer"
          >
            {cardData?.heading}
          </Link>
          <p className="text-left mb-6 text-base">{cardData?.description}</p>
        </div>
        <div className="flex justify-between w-full p-3">
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
