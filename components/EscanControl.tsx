import React, { useState, useEffect } from 'react';
import { MOCK_COURSES } from '../constants';
import type { Course } from '../types';
import ConfirmationModal from './shared/ConfirmationModal';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const PaperclipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>;


const CourseModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onSubmit: (course: Course) => void;
    course?: Course | null; 
}> = ({ isOpen, onClose, onSubmit, course }) => {
    const isEditMode = !!course;
    const [title, setTitle] = useState('');
    const [instructor, setInstructor] = useState('');
    const [price, setPrice] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [materialsFile, setMaterialsFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    
     const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!title.trim()) newErrors.title = 'Course title is required.';
        if (!instructor.trim()) newErrors.instructor = 'Instructor name is required.';
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum <= 0) newErrors.price = 'Price must be a positive number.';
        if (!coverImage) newErrors.coverImage = 'A cover image is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
     useEffect(() => {
        if (isOpen) {
            validate();
        }
    }, [title, instructor, price, coverImage, isOpen]);

    useEffect(() => {
        if (isEditMode && course) {
            setTitle(course.title);
            setInstructor(course.instructor);
            setPrice(course.price.toString());
            setCoverImage(course.coverImageUrl);
            setMaterialsFile(null); 
        } else {
            setTitle('');
            setInstructor('');
            setPrice('');
            setCoverImage(null);
            setMaterialsFile(null);
        }
         setTouched({});
         setErrors({});
    }, [course, isEditMode, isOpen]);


    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setCoverImage(base64);
        }
    };
    
    const handleMaterialsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaterialsFile(e.target.files?.[0] || null);
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({...prev, [field]: true}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({title: true, instructor: true, price: true, coverImage: true});
        if (!validate()) {
            return;
        }

        const materialsFileData = materialsFile ? { name: materialsFile.name, size: materialsFile.size } : (isEditMode ? course.materialsFile : undefined);

        const submittedCourse: Course = {
            id: isEditMode ? course.id : `c${Date.now()}`,
            title,
            instructor,
            price: parseFloat(price),
            coverImageUrl: coverImage!,
            materialsFile: materialsFileData,
            students: isEditMode ? course.students : 0,
            status: isEditMode ? course.status : 'Upcoming',
        };

        onSubmit(submittedCourse);
        onClose();
    };
    
    if (!isOpen) return null;
    
    const isFormValid = Object.keys(errors).length === 0;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-xl p-6 md:p-8 w-full max-w-lg animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl md:text-2xl font-bold mb-6">{isEditMode ? 'Edit Course' : 'Add New Course'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <input type="text" placeholder="Course Title" value={title} onChange={e => setTitle(e.target.value)} onBlur={() => handleBlur('title')} className={`w-full bg-brand-dark rounded-lg py-2 px-4 focus:outline-none focus:ring-2 transition-colors ${touched.title && errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-brand-accent'}`} />
                        {touched.title && errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                    </div>
                     <div>
                        <input type="text" placeholder="Instructor Name" value={instructor} onChange={e => setInstructor(e.target.value)} onBlur={() => handleBlur('instructor')} className={`w-full bg-brand-dark rounded-lg py-2 px-4 focus:outline-none focus:ring-2 transition-colors ${touched.instructor && errors.instructor ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-brand-accent'}`} />
                         {touched.instructor && errors.instructor && <p className="text-red-400 text-xs mt-1">{errors.instructor}</p>}
                    </div>
                     <div>
                        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} onBlur={() => handleBlur('price')} className={`w-full bg-brand-dark rounded-lg py-2 px-4 focus:outline-none focus:ring-2 transition-colors ${touched.price && errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-brand-accent'}`} min="0" step="0.01" />
                        {touched.price && errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Cover Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} onBlur={() => handleBlur('coverImage')} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"/>
                        {touched.coverImage && errors.coverImage && <p className="text-red-400 text-xs mt-1">{errors.coverImage}</p>}
                        {coverImage && <img src={coverImage} alt="Cover preview" className="mt-4 w-full h-40 object-cover rounded-md" />}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Course Materials (Optional)</label>
                        <input type="file" onChange={handleMaterialsFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"/>
                        {materialsFile && <p className="text-xs text-brand-text-secondary mt-2">Selected: {materialsFile.name} ({(materialsFile.size / 1024).toFixed(1)} KB)</p>}
                        {!materialsFile && isEditMode && course.materialsFile && <p className="text-xs text-brand-text-secondary mt-2">Current file: {course.materialsFile.name}</p>}
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95">Cancel</button>
                        <button type="submit" disabled={!isFormValid} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">{isEditMode ? 'Update Course' : 'Add Course'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EscanControl: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCourses(prevCourses =>
                prevCourses.map(course => {
                    let newCourse = { ...course };
                    if (newCourse.status === 'Live') {
                        newCourse.students += Math.floor(Math.random() * 5);
                    } else if (newCourse.status === 'Upcoming' && Math.random() > 0.98) {
                        newCourse.status = 'Live';
                    }
                    return newCourse;
                })
            );
        }, 3500);

        return () => clearInterval(intervalId);
    }, []);

    const handleAddCourse = (newCourse: Course) => {
        setCourses(prev => [newCourse, ...prev]);
    };

    const handleUpdateCourse = (updatedCourse: Course) => {
        setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    };

    const handleDeleteCourse = () => {
        if (!courseToDelete) return;
        setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
        setCourseToDelete(null);
    };

    const handleOpenEditModal = (course: Course) => {
        setCourseToEdit(course);
        setIsCourseModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setCourseToEdit(null);
        setIsCourseModalOpen(true);
    };
    
    const handleCloseCourseModal = () => {
        setIsCourseModalOpen(false);
        setCourseToEdit(null);
    }

    return (
        <div className="space-y-6">
            <CourseModal 
                isOpen={isCourseModalOpen} 
                onClose={handleCloseCourseModal} 
                onSubmit={courseToEdit ? handleUpdateCourse : handleAddCourse}
                course={courseToEdit}
            />
             <ConfirmationModal
                isOpen={!!courseToDelete}
                onClose={() => setCourseToDelete(null)}
                onConfirm={handleDeleteCourse}
                title="Delete Course"
                message={<>Are you sure you want to delete the course "<strong>{courseToDelete?.title}</strong>"?</>}
                confirmButtonText="Delete"
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <h2 className="text-2xl font-bold">ESCAN Course Management</h2>
                <button 
                    onClick={handleOpenAddModal}
                    className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 self-start md:self-auto"
                >
                    Add New Course
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                    <div key={course.id} className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: `${100 * (index + 1)}ms` }}>
                        <div className="relative">
                            <img src={course.coverImageUrl} alt={course.title} className="w-full h-40 object-cover" />
                            {course.materialsFile && (
                                <div className="absolute top-2 right-2 bg-brand-accent/80 text-white rounded-full p-1.5 backdrop-blur-sm" title={`Includes: ${course.materialsFile.name}`}>
                                    <PaperclipIcon />
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${course.status === 'Live' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {course.status}
                            </span>
                            <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                            <p className="text-sm text-brand-text-secondary mb-4">By {course.instructor}</p>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white font-semibold">${course.price}</span>
                                <span className="text-brand-text-secondary">{course.students.toLocaleString()} students</span>
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <button onClick={() => handleOpenEditModal(course)} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">Edit</button>
                                <button onClick={() => setCourseToDelete(course)} className="w-full bg-red-800/50 hover:bg-red-800/80 text-red-300 font-semibold py-2 px-4 rounded-lg text-sm">Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EscanControl;