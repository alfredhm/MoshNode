const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err))

const courseSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true,
      minlength: 5,
      maxlength: 255,
      // match: /pattern/
    },
    category: {
      type: String,
      required: true,
      enum: ['web', 'mobile', 'network'],
      lowercase: true,
      // uppercase: true,
      trim: true
    },
    author: String,
    tags: {
      type: Array,
      validate: {
        validator: function (v) {
          return new Promise((callback) => {
            setTimeout(() => {
              const result = v && v.length > 0;
              callback(result);
            }, 4000)
          })
        },
        message: 'A course should have at least one tag.'
      }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
      type: Number,
      required: function() { return this.isPublished },
      min: 10,
      max: 200,
      get: v => Math.round(v),
      set: v => Math.round(v)
    }
})

const Course = mongoose.model('Course', courseSchema)

async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        category: 'Web',
        author: 'Mosh',
        tags: ['frontend'],
        isPublished: true,
        price: 15.8
    })
    
    try {
      const result = await course.save();
      console.log(result)
    } catch (ex) {
      for (field in ex.errors) 
        console.log(ex.errors[field].message)
    }

}

async function getCourses() {
    const courses = await Course
      .find({ _id: '655a478076c13b0208bece44'})
      // .skip((pageNumber - 1) * pageSize)
      // .limit(pageSize)
      .sort({ name: 1 })
      .select({ name: 1, tags: 1, price: 1})
    console.log(courses[0].price)
}

async function updateCourse(id) {
  const course = await Course.findByIdAndUpdate(id, {
    $set: {
      author: 'Fredo',
      isPublished: false
    }
  }, { new: true });

  console.log(course);
}

async function removeCourse(id) {
  // const result = await Course.deleteOne({ _id: id })
  const course = await Course.findByIdAndDelete(id) 
  console.log(course)
}

getCourses();











    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in
    // nin (not in)

    //----------------------------

    // or
    // and

        //.find({ author: 'Mosh', isPublished: true })
      //.find({ price: { $gte: 10, $lte: 20 } })
      //.find({ price: { $in: [10, 15, 20] } })

      //.find()
      //.or([ { author: 'Mosh' } , { isPublished: true} ])
      //.and([ ])

      // Starts with Mosh
      // .find({ author: /^Mosh/ })

      // Ends with Hamedani
      // .find({ author: /Hamedani$/i })

      // Contains Mosh
      // .find({ author: /.*Mosh.*/i })