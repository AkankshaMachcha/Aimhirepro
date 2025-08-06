import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getLatestResume } from '../../services/resumeService';


const initialState = {
  resumeData: {
    title: '',
    summary: '',
    experienceList: [],
    educationList: [],
    achievementList: [],
    certificationList: [],
    languageList: [],
    projectList: [],
    personalLinkList: [],
    skillList: [],
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      dateOfBirth: ''
    },
    visibility: 'PRIVATE',
    templateName: 'DefaultTemplate',
    themeColor: '#0057D9'
  },
  layoutConfig: [
    { id: "contact", visible: true },
    { id: "summary", visible: true },
    { id: "experience", visible: true },
    { id: "education", visible: true },
    { id: "projects", visible: true },
    { id: "certifications", visible: true },
    { id: "achievements", visible: true },
    { id: "languages", visible: true },
    { id: "personalLinks", visible: true },
    { id: "skills", visible: true },
  ],
  editingSectionId: null,
  resumeMeta: null,
  editMode: false,
  editingVersionLabel: "",
  cloneMode: false,
};


export const loadLatestResume = createAsyncThunk(
  'resumeBuilder/loadLatestResume',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const resume = await getLatestResume();
      dispatch(setResumeMeta(resume)); // stores full ResumeResponse
      return resume;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const resumeBuilderSlice = createSlice({
  name: 'resumeBuilder',
  initialState,
  reducers: {
    reorderSection: (state, action) => {
      const { id, direction } = action.payload;
      const index = state.layoutConfig.findIndex(s => s.id === id);
      const target = direction === 'up' ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= state.layoutConfig.length) return;
      const temp = state.layoutConfig[index];
      state.layoutConfig[index] = state.layoutConfig[target];
      state.layoutConfig[target] = temp;
    },
    reorderSections: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      if (!Array.isArray(state.layoutConfig)) return;
      const updated = [...state.layoutConfig];
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(destinationIndex, 0, moved);
      state.layoutConfig = updated;
    },
    setEditingSection: (state, action) => {
      state.editingSectionId = action.payload;
    },
    toggleSectionVisibility: (state, action) => {
      const section = state.layoutConfig.find(s => s.id === action.payload);
      if (section) section.visible = !section.visible;
    },
    updateExperienceList: (state, action) => {
      state.resumeData.experienceList = action.payload;
    },
    updateEducationList: (state, action) => {
      state.resumeData.educationList = action.payload;
    },
    updateSkillList: (state, action) => {
      state.resumeData.skillList = action.payload;
    },
    updateAchievementList: (state, action) => {
      state.resumeData.achievementList = action.payload;
    },
    updateCertificationList: (state, action) => {
      state.resumeData.certificationList = action.payload;
    },
    updateLanguageList: (state, action) => {
      state.resumeData.languageList = action.payload;
    },
    updateProjectList: (state, action) => {
      state.resumeData.projectList = action.payload;
    },
    updatePersonalLinkList: (state, action) => {
      state.resumeData.personalLinkList = action.payload;
    },
    updateTitle: (state, action) => {
      state.resumeData.title = action.payload;
    },
    updateSummary: (state, action) => {
      state.resumeData.summary = action.payload;
    },
    updateVisibility: (state, action) => {
      state.resumeData.visibility = action.payload;
    },
    updateContactInfo: (state, action) => {
      state.resumeData.contactInfo = action.payload;
    },
    updateTemplateName: (state, action) => {
      state.resumeData.templateName = action.payload;
    },
    updateThemeColor: (state, action) => {
      state.resumeData.themeColor = action.payload;
    },
    updateResumeData: (state, action) => {
      state.resumeData = action.payload;
    },
    updateLayoutConfig: (state, action) => {
      state.layoutConfig = action.payload;
    },
    setResumeMeta: (state, action) => {
      state.resumeMeta = action.payload;
    },
    loadResumeForEdit: (state, action) => {
      const resume = action.payload;

      state.resumeData = {
        title: resume.title || '',
        summary: resume.summary || '',
        visibility: resume.visibility || 'PRIVATE',
        templateName: resume.templateName || 'DefaultTemplate',
        themeColor: resume.themeColor || '#0057D9',
        contactInfo: {
          firstName: resume.resumeContactInfoResponse?.firstName || '',
          lastName: resume.resumeContactInfoResponse?.lastName || '',
          email: resume.resumeContactInfoResponse?.email || '',
          phoneNumber: resume.resumeContactInfoResponse?.phoneNumber || '',
          address: resume.resumeContactInfoResponse?.address || '',
          city: resume.resumeContactInfoResponse?.city || '',
          state: resume.resumeContactInfoResponse?.state || '',
          country: resume.resumeContactInfoResponse?.country || '',
          postalCode: resume.resumeContactInfoResponse?.postalCode || ''
        },
        experienceList: resume.experienceList || [],
        educationList: resume.educationList || [],
        projectList: resume.projectList || [],
        skillList: resume.skillList || [],
        achievementList: resume.achievementList || [],
        certificationList: resume.certificationList || [],
        languageList: resume.languageList || [],
        personalLinkList: resume.personalLinkList || []
      };

      state.editMode = true;
      state.editingVersionLabel = resume.versionLabel;
    },
    resetEditMode: (state) => {
      state.editMode = false;
      state.editingVersionLabel = '';
    },
    cloneResumeFromMeta: (state, action) => {
      const resume = action.payload;

      state.resumeData = {
        title: resume.title || '',
        summary: resume.summary || '',
        visibility: resume.visibility || 'PRIVATE',
        templateName: resume.templateName || 'DefaultTemplate',
        themeColor: resume.themeColor || '#0057D9',
        contactInfo: resume.resumeContactInfoResponse || {
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        },
        experienceList: resume.experienceList || [],
        educationList: resume.educationList || [],
        projectList: resume.projectList || [],
        skillList: resume.skillList || [],
        achievementList: resume.achievementList || [],
        certificationList: resume.certificationList || [],
        languageList: resume.languageList || [],
        personalLinkList: resume.personalLinkList || []
      };

      state.editMode = false;
      state.cloneMode = true;
      state.editingVersionLabel = '';
    },
    resetCloneMode: (state) => {
      state.cloneMode = false;
    }

  }
});

export const {
  reorderSection,
  toggleSectionVisibility,
  reorderSections,
  setEditingSection,
  updateExperienceList,
  updateEducationList,
  updateSkillList,
  updateAchievementList,
  updateCertificationList,
  updateLanguageList,
  updateProjectList,
  updatePersonalLinkList,
  updateTitle,
  updateSummary,
  updateVisibility,
  updateContactInfo,
  updateTemplateName,
  updateThemeColor,
  updateResumeData,
  updateLayoutConfig,
  setResumeMeta,
  loadResumeForEdit,
  resetEditMode,
  cloneResumeFromMeta,
  resetCloneMode
} = resumeBuilderSlice.actions;

export default resumeBuilderSlice.reducer;
