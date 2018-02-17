// const { Types } = require('enmapi/database/utils');

// module.exports = {
//   ModelNameHere: {
//     Schema: {
//       field_name_1: {
//         type: String,
//         required: true,
//         unique: true
//       },
//       field_name_2: {
//         type: Types.ObjectId,
//         ref: AnotherModelName
//       }
//     },
//     Hooks: Schema => {
//       Schema.pre('save', function preSaveFunction(next) {
//         const modelNameHereRecord = this;
//         // Do something pre save
//         next()
//       });
//     },
//     Methods: Schema => {
//       Schema.methods.aNewMethodHere = function aNewMethodHere() {
//         const modelNameHereRecord = this;
//         // Do something with record here
//       }
//     }
//   }
// };