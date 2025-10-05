import React, { useState, useEffect } from 'react';
import { MOCK_EBOOKS } from '../constants';
import type { Ebook } from '../types';
import ConfirmationModal from './shared/ConfirmationModal';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const EbookModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onSubmit: (ebook: Ebook) => void; 
    ebook?: Ebook | null;
}> = ({ isOpen, onClose, onSubmit, ebook }) => {
    const isEditMode = !!ebook;
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [ebookFile, setEbookFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!title.trim()) newErrors.title = 'Ebook title is required.';
        if (!author.trim()) newErrors.author = 'Author name is required.';
        if (!coverImage) newErrors.coverImage = 'A cover image is required.';
        if (!isEditMode && !ebookFile) newErrors.ebookFile = 'The ebook file is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    useEffect(() => {
        if(isOpen) {
            validate();
        }
    }, [title, author, coverImage, ebookFile, isOpen]);


    useEffect(() => {
        if (isEditMode && ebook) {
            setTitle(ebook.title);
            setAuthor(ebook.author);
            setCoverImage(ebook.coverImageUrl);
            setEbookFile(null); // Can't pre-populate file input
        } else {
            setTitle('');
            setAuthor('');
            setCoverImage(null);
            setEbookFile(null);
        }
        setTouched({});
        setErrors({});
    }, [ebook, isEditMode, isOpen]);


    const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setCoverImage(base64);
        }
    };
    
    const handleEbookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEbookFile(file);
        }
    };
    
    const handleBlur = (field: string) => {
        setTouched(prev => ({...prev, [field]: true}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ title: true, author: true, coverImage: true, ebookFile: true });
        if (!validate()) {
            return;
        }
        
        const fileData = ebookFile ? { name: ebookFile.name, size: ebookFile.size } : (isEditMode ? ebook.file : undefined);
        
        const submittedEbook: Ebook = {
            id: isEditMode ? ebook.id : `e${Date.now()}`,
            title,
            author,
            coverImageUrl: coverImage!,
            file: fileData,
            sales: isEditMode ? ebook.sales : 0,
            revenue: isEditMode ? ebook.revenue : 0,
            status: isEditMode ? ebook.status : 'Pending',
        };

        onSubmit(submittedEbook);
        onClose();
    };

    if (!isOpen) return null;
    
    const isFormValid = Object.keys(errors).length === 0;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-xl p-6 md:p-8 w-full max-w-lg animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl md:text-2xl font-bold mb-6">{isEditMode ? 'Edit Ebook' : 'Upload New Ebook'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input type="text" placeholder="Ebook Title" value={title} onChange={e => setTitle(e.target.value)} onBlur={() => handleBlur('title')} className={`w-full bg-brand-dark rounded-lg py-2 px-4 focus:outline-none focus:ring-2 transition-colors ${touched.title && errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-brand-accent'}`} />
                        {touched.title && errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                    </div>
                     <div>
                        <input type="text" placeholder="Author Name" value={author} onChange={e => setAuthor(e.target.value)} onBlur={() => handleBlur('author')} className={`w-full bg-brand-dark rounded-lg py-2 px-4 focus:outline-none focus:ring-2 transition-colors ${touched.author && errors.author ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-brand-accent'}`} />
                        {touched.author && errors.author && <p className="text-red-400 text-xs mt-1">{errors.author}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Cover Image</label>
                        <input type="file" accept="image/*" onChange={handleCoverImageChange} onBlur={() => handleBlur('coverImage')} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"/>
                        {touched.coverImage && errors.coverImage && <p className="text-red-400 text-xs mt-1">{errors.coverImage}</p>}
                        {coverImage && <img src={coverImage} alt="Cover preview" className="mt-4 w-32 h-48 object-cover rounded-md" />}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Ebook File (PDF, EPUB)</label>
                        <input type="file" accept=".pdf,.epub" onChange={handleEbookFileChange} onBlur={() => handleBlur('ebookFile')} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"/>
                        {touched.ebookFile && errors.ebookFile && <p className="text-red-400 text-xs mt-1">{errors.ebookFile}</p>}
                        {ebookFile && <p className="text-xs text-brand-text-secondary mt-2">Selected: {ebookFile.name} ({(ebookFile.size / 1024).toFixed(1)} KB)</p>}
                        {!ebookFile && isEditMode && ebook.file && <p className="text-xs text-brand-text-secondary mt-2">Current file: {ebook.file.name}</p>}
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95">Cancel</button>
                        <button type="submit" disabled={!isFormValid} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">{isEditMode ? 'Update Ebook' : 'Add Ebook'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EbokControl: React.FC = () => {
    const [ebooks, setEbooks] = useState<Ebook[]>(MOCK_EBOOKS);
    const [isEbookModalOpen, setIsEbookModalOpen] = useState(false);
    const [ebookToEdit, setEbookToEdit] = useState<Ebook | null>(null);
    const [ebookToDelete, setEbookToDelete] = useState<Ebook | null>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setEbooks(prevEbooks =>
                prevEbooks.map(ebook => {
                    let newEbook = { ...ebook };
                    if (newEbook.status === 'Published') {
                        const newSales = Math.floor(Math.random() * 3);
                        if (newSales > 0) {
                             const pricePerBook = newEbook.sales > 0 ? newEbook.revenue / newEbook.sales : 9.99;
                             newEbook.sales += newSales;
                             newEbook.revenue += newSales * pricePerBook;
                        }
                    } else if (newEbook.status === 'Pending' && Math.random() > 0.97) {
                        newEbook.status = 'Published';
                    }
                    return newEbook;
                })
            );
        }, 4500);

        return () => clearInterval(intervalId);
    }, []);
    
    const handleAddEbook = (newEbook: Ebook) => {
        setEbooks(prev => [newEbook, ...prev]);
    };
    
    const handleUpdateEbook = (updatedEbook: Ebook) => {
        setEbooks(prev => prev.map(e => e.id === updatedEbook.id ? updatedEbook : e));
    };

    const handleDeleteEbook = () => {
        if (!ebookToDelete) return;
        setEbooks(prev => prev.filter(e => e.id !== ebookToDelete.id));
        setEbookToDelete(null);
    };

    const handleOpenEditModal = (ebook: Ebook) => {
        setEbookToEdit(ebook);
        setIsEbookModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setEbookToEdit(null);
        setIsEbookModalOpen(true);
    };
    
    const handleCloseEbookModal = () => {
        setIsEbookModalOpen(false);
        setEbookToEdit(null);
    };


    const getStatusClass = (status: Ebook['status']) => {
        switch (status) {
            case 'Published': return 'bg-green-500/20 text-green-400';
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
        }
    }

    return (
         <div className="space-y-6">
            <EbookModal 
                isOpen={isEbookModalOpen} 
                onClose={handleCloseEbookModal} 
                onSubmit={ebookToEdit ? handleUpdateEbook : handleAddEbook}
                ebook={ebookToEdit}
            />
            <ConfirmationModal
                isOpen={!!ebookToDelete}
                onClose={() => setEbookToDelete(null)}
                onConfirm={handleDeleteEbook}
                title="Delete Ebook"
                message={<>Are you sure you want to delete the ebook "<strong>{ebookToDelete?.title}</strong>"?</>}
                confirmButtonText="Delete"
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <h2 className="text-2xl font-bold">EBOK Marketplace Management</h2>
                <button 
                    onClick={handleOpenAddModal}
                    className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 self-start md:self-auto active:scale-95"
                >
                    Upload New Ebook
                </button>
            </div>

            <div className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-brand-text-secondary whitespace-nowrap">
                        <thead className="text-xs text-brand-text uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Ebook Title</th>
                                <th scope="col" className="px-6 py-3">Author</th>
                                <th scope="col" className="px-6 py-3">Sales</th>
                                <th scope="col" className="px-6 py-3">Revenue</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ebooks.map((ebook, index) => (
                                <tr key={ebook.id} className="bg-brand-secondary border-b border-gray-700 hover:bg-gray-700/50 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}>
                                    <th scope="row" className="px-6 py-4 font-medium text-white flex items-center">
                                        <img src={ebook.coverImageUrl} alt={ebook.title} className="w-8 h-12 rounded-sm mr-4 object-cover flex-shrink-0"/>
                                        <span className="whitespace-normal">{ebook.title}</span>
                                    </th>
                                    <td className="px-6 py-4">{ebook.author}</td>
                                    <td className="px-6 py-4">{ebook.sales.toLocaleString()}</td>
                                    <td className="px-6 py-4">${ebook.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(ebook.status)}`}>
                                            {ebook.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button onClick={() => handleOpenEditModal(ebook)} className="font-medium text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Edit</button>
                                        <button onClick={() => setEbookToDelete(ebook)} className="font-medium text-red-500 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EbokControl;