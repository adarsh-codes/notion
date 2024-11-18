import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setStep, setEditCourse } from '../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../utils/constants';
import { addCourseToCategory, editCourseDetails } from '../../../../services/operations/courseDetailsAPI';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PublishCourse = () => {
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
    const { token } = useSelector((state) => state.auth);
    const { course } = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Set initial checkbox value based on course status
    useEffect(() => {
        if (course?.status === COURSE_STATUS.PUBLISHED) {
            setValue("public", true);
        }
    }, [course?.status, setValue]);

    const goBack = () => {
        dispatch(setStep(2));
    };

    const goToMyCourses = () => {
        navigate("/dashboard/my-courses");
    };

    const handlePublish = async () => {
        try {
            setLoading(true);

            const isPublic = getValues("public");
            const newStatus = isPublic ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;

            // Check if status update is necessary
            if (course?.status === newStatus) {
                goToMyCourses();
                dispatch(setStep(1));
                dispatch(setEditCourse(null));
                return;
            }

            // Update course status
            const formData = new FormData();
            formData.append("courseId", course?._id);
            formData.append("status", newStatus);

            const result = await editCourseDetails(formData, token);

            // Add course to category if publishing
            if (isPublic) {
                const category_id = course?.category?._id || course.category; // Handle populated or plain category
                const addCourseCategory = await addCourseToCategory({ categoryId: category_id, courseId: course._id }, token);

                if (!addCourseCategory) {
                    throw new Error("Failed to add course to category");
                }
            }

            if (result) {
                toast.success("Course published successfully!");
                goToMyCourses();
                dispatch(setStep(1));
                dispatch(setEditCourse(null));
            } else {
                throw new Error("Failed to publish the course");
            }
        } catch (error) {
            console.error("Error in handlePublish:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = () => {
        handlePublish();
    };

    return (
        <div>
            <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
                <p className="text-2xl font-semibold text-richblack-5">Publish Settings</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="my-6 mb-8">
                        <label htmlFor="public" className="inline-flex items-center text-lg">
                            <input
                                defaultChecked={false}
                                type="checkbox"
                                id="public"
                                name="public"
                                className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
                                {...register("public")}
                            />
                            <span className="ml-2 text-richblack-400">Make this course public</span>
                        </label>
                    </div>
                    <div className="ml-auto flex max-w-max items-center gap-x-4">
                        <button
                            disabled={loading}
                            onClick={goBack}
                            type="button"
                            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                        >
                            Back
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PublishCourse;
