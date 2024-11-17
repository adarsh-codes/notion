const Category = require("../models/Category");
const Course = require("../models/Course");

// create category kaa handler function
exports.createCategory = async (req, res) => {
	try {
		// extracting data from the request
		const { name, description } = req.body;

		// validation
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		// create entry in DB
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);

		// return response
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	}

	catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

// getAllCategorory kaa handler function
exports.showAllCategories = async (req, res) => {
	try {
		// return only name and description [can use select also]
		const allCategorys = await Category.find(
			{},
			{ name: true, description: true }
		);

		// return response
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	}

	catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getCategoryPageDetails = async (req, res) => {
	try {
		const { categoryName } = req.body;

		// Get courses for the specified category
		const selectedCategory = await Category.findOne({categoryName})          // populate instuctor and rating and reviews from courses
			.populate({ path: "courses", match: { status: "Published" }, populate: ([{ path: "instructor" }, { path: "ratingAndReviews" }]) })
			.exec();
		// console.log(selectedCategory);

		// Handle the case when the category is not found
		if (!selectedCategory) {
			console.log("Category not found.");
			return res
				.status(404)
				.json({ success: false, message: "Category not found" });
		}

		// Handle the case when there are no courses
		if (selectedCategory.courses.length === 0) {
			console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}

		const selectedCourses = selectedCategory.courses;
		// TODO: Handle the case

		// Get courses for other categories
		const categoriesExceptSelected = await Category.find({
			name: { $ne: categoryName },
		}).populate({ path: "courses", match: { status: "Published" }, populate: [{ path: "instructor" }, { path: "ratingAndReviews" }] });
		let differentCourses = [];
		for (const category of categoriesExceptSelected) {
			if (Array.isArray(category.courses) && category.courses.length > 0)
				differentCourses.push(...category.courses);
		}
		// console.log(categoriesExceptSelected)

		// Get top-selling courses across all categories
		const allCategories = await Category.find().populate({ path: "courses", match: { status: "Published" }, populate: ([{ path: "instructor" }, { path: "ratingAndReviews" }]) });
		const allCourses = allCategories.flatMap((category) => category.courses);
		// Using flatMap => allCourses array would be ['Course 1', 'Course 2', 'Course 3', 'Course 4'] like this.

		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 10);

		res.status(200).json({
			selectedCourses: selectedCourses,
			differentCourses: differentCourses,
			mostSellingCourses: mostSellingCourses,
			success: true,
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Error in categoryPageDetails",
			error: error.message,
		});
	}
};

// add course to category
exports.addCourseToCategory = async (req, res) => {
	try {
		const { courseId, categoryId } = req.body;
		// console.log("category id", categoryId);
		
		// validation
		const category = await Category.findById(categoryId);
		if (!category) {
			console.log("category not found");
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}

		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}
		if (category.courses.includes(courseId)) {
			return res.status(200).json({
				success: true,
				message: "Course already exists in the category",
			});
		}

		category.courses.push(courseId);
		await category.save();
		return res.status(200).json({
			success: true,
			message: "Course added to category successfully",
		});
	}
	catch (error) {
		return res.status(500).json({
			success: false,
			message: "Error in addCourseToCategory",
			error: error.message,
		});
	}
}