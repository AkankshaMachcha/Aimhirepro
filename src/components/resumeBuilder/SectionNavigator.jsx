import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import SectionCard from './SectionCard';

import {
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

} from '../../redux/slices/resumeBuilderSlice';
import { updateContactInfo } from '../../redux/slices/resumeBuilderSlice';
import ExperienceFormModal from './sectionForms/ExperienceFormModal';
import EducationFormModal from './sectionForms/EducationFormModal';
import ProjectFormModal from './sectionForms/ProjectFormModal';
import SkillFormModal from './sectionForms/SkillFormModal';
import AchievementFormModal from './sectionForms/AchievementFormModal';
import CertificationFormModal from './sectionForms/CertificationFormModal';
import LanguageFormModal from './sectionForms/LanguageFormModal';
import PersonalLinkFormModal from './sectionForms/PersonalLinkFormModal';
import ContactFormModal from './sectionForms/ContactFormModal';
import SummaryFormModal from './sectionForms/SummaryFormModal';

const SectionNavigator = () => {
  const dispatch = useDispatch();
  // const layoutConfig = useSelector((state) => state.resumeBuilder.layoutConfig);
  const editingSectionId = useSelector((state) => state.resumeBuilder.editingSectionId);
 


  // const resumeData = useSelector((state) => state.resumeBuilder.resumeData);
  const { resumeData, layoutConfig } = useSelector((state) => state.resumeBuilder);
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    dispatch(
      reorderSections({
        sourceIndex: result.source.index,
        destinationIndex: result.destination.index,
      })
    );
  };

  return (
    <div className="section-navigator">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="section-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {layoutConfig.map((section, index) => {
                const id = section.id;
                const label = id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const hidden = !section.visible;

                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          marginBottom: '12px',
                          boxShadow: snapshot.isDragging
                            ? '0 4px 10px rgba(0,0,0,0.1)'
                            : 'none',
                        }}
                      >
                        <SectionCard
                          section={{ id, label, hidden }}
                          onEdit={(sectionId) => dispatch(setEditingSection(sectionId))}
                          onReorder={(sectionId, direction) =>
                            dispatch(reorderSection({ id: sectionId, direction }))
                          }
                          onToggleVisibility={(sectionId) =>
                            dispatch(toggleSectionVisibility(sectionId))
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {editingSectionId === 'experience' && (
        <ExperienceFormModal
          show={true}
          handleClose={() => dispatch(setEditingSection(null))}
          onSave={(data) => dispatch(updateExperienceList(data))}
          initialData={resumeData.experienceList}
          
        />
      )}

      {editingSectionId === 'education' && (
        <EducationFormModal
          show={true}
          handleClose={() => dispatch(setEditingSection(null))}
          onSave={(data) => dispatch(updateEducationList(data))}
          initialData={resumeData.educationList}
        />
      )}

      {editingSectionId === 'projects' && (
        <ProjectFormModal
          show={true}
          handleClose={() => dispatch(setEditingSection(null))}
          onSave={(data) => dispatch(updateProjectList(data))}
          initialData={resumeData.projectList}
        />
      )}

      {editingSectionId === 'skills' && (
        <SkillFormModal
          show={true}
          handleClose={() => dispatch(setEditingSection(null))}
          onSave={(data) => dispatch(updateSkillList(data))}
          initialData={resumeData.skillList}
        />
      )}

      {editingSectionId === 'achievements' && (
        <AchievementFormModal
          show={true}
          handleClose={() => dispatch(setEditingSection(null))}
          onSave={(data) => dispatch(updateAchievementList(data))}
           initialData={resumeData.achievementList}
        />
      )}

      {editingSectionId === 'certifications' && (
        <CertificationFormModal
          show={true}
          handleClose={() => dispatch(setEditingSection(null))}
          onSave={(data) => dispatch(updateCertificationList(data))}
           initialData={resumeData.certificationList}
        />
      )}

      {editingSectionId === 'languages' && (
        <LanguageFormModal
          show={true}
          handleClose={() => dispatch(setEditingSection(null))}
          onSave={(data) => dispatch(updateLanguageList(data))}
           initialData={resumeData.languageList}
        />
      )}

      {editingSectionId === 'personalLinks' && (
        <PersonalLinkFormModal
          show={true}
          handleClose={() => dispatch(setEditingSection(null))}
          onSave={(data) => dispatch(updatePersonalLinkList(data))}
          initialData={resumeData.personalLinkList}
        />
      )}


      {editingSectionId === 'contact' && (
        <ContactFormModal
          show={true}
          handleClose={() => dispatch(setEditingSection(null))}
          initialData={resumeData.contactInfo} // optional, for prefill
          onSave={async (data) => {
            dispatch(updateContactInfo(data));           // ✅ Redux action
          }}
        />
      )}

      {editingSectionId === 'summary' && (
        <SummaryFormModal
          show={true}
          handleClose={() => dispatch(setEditingSection(null))}
          initialData={resumeData}
          onSave={({ title, summary, visibility }) => {
            dispatch(updateTitle(title));
            dispatch(updateSummary(summary));
            dispatch(updateVisibility(visibility));
          }}
        />
      )}
    </div>
  );
};

export default SectionNavigator;
