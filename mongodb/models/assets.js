import mongoose from 'mongoose';

const businessQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    description: { type: String, required: true },
});

const kpiSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, // KPI
    description: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    tags: { type: [String], default: [] },
    usedCount: { type: Number, default: 0 },
    favoritedCount: { type: Number, default: 0 },
    favorited: { type: Boolean, default: false },
    sharedCount: { type: Number, default: 0 },
    businessQuestion: [businessQuestionSchema],
    preview: { type: [String], default: [] },
    metricID: { type: String, required: true, unique: true },
    calculation: { type: String, required: true },
    affiliateApplicability: { type: Boolean, default: false },
    access: {type:String ,required:true}, //granted/requested/restricted
});

const layoutSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, // Layout
    description: { type: String, required: true },
    type: { type: String, required: true },
    about: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    tags: { type: [String], default: [] },
    usedCount: { type: Number, default: 0 },
    favoritedCount: { type: Number, default: 0 },
    favorited: { type: Boolean, default: false, required:true },
    sharedCount: { type: Number, default: 0 },
    businessQuestion: [businessQuestionSchema],
    preview: { type: [String], default: [] },
    kpiUsed: { type: [String], default: [] },
    access: {type:String ,required:true}, 
});

const visualizationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required:true }, // Visualization
    description:{type:String ,required:true},
    lastUpdated:{type : Date ,default : Date.now},
    tags:{type:[String],default : []},
    usedCount:{type:Number ,default : 0},
    favoritedCount:{type:Number ,default : 0},
    sharedCount:{type:Number ,default : 0},
    preview: { type: [String], default: [] },
    applicableKpiIDs: { type: [String], default: [] },
    infoContext:{type:String ,required:true},
    access: {type:String ,required:true}, 
});

const storyboardSchema = new mongoose.Schema({
    title:{type:String ,required:true},
    category:{type:String ,required:true}, // Storyboard
    description:{type:String ,required:true},
    lastUpdated:{type : Date ,default : Date.now},
    tags:{type:[String],default : []},
    usedCount:{type:Number ,default : 0},
    favoritedCount:{type:Number ,default : 0},
    favorited: { type: Boolean, default: false },
    sharedCount:{type:Number ,default : 0},
    kpifilters:[{type:String}],
    preview: { type: [String], default: [] },
    affiliates:{type:String ,required:true}, 
    access: {type:String ,required:true},
});

const requestSchema = new mongoose.Schema({
   title:{type:String ,required:true},
   category:{type:String ,required:true},
   description:{type:String ,required:true},
   purpose:{type:String ,required:true},
   requestedByID: { type: String, required: true },
});

const searchQuerySchema = new mongoose.Schema({
    query:{type:String ,required:true},
    user:{type:String ,required:true},
    date:{type : Date ,default : Date.now},
 });

const KPI = mongoose.model('KPI', kpiSchema);
const Layout = mongoose.model('Layout', layoutSchema);
const Visualization = mongoose.model('Visualization', visualizationSchema);
const Storyboard = mongoose.model('Storyboard', storyboardSchema);
const Request = mongoose.model('Request', requestSchema);
const SearchQuery = mongoose.model('SearchQuery', searchQuerySchema);

export {
   KPI,
   Layout,
   Visualization,
   Storyboard,
   Request,
   SearchQuery
};
