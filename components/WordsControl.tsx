import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_POSTS } from '../constants';
import { generateBlogPost } from '../services/geminiService';
import type { BlogPost } from '../types';
import ConfirmationModal from './shared/ConfirmationModal';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const AiModal: React.FC<{ onClose: () => void, setGeneratedContent: (content: string) => void }> = ({ onClose, setGeneratedContent }) => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!topic) {
            setError('Please enter a topic.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const content = await generateBlogPost(topic);
            setGeneratedContent(content);
            onClose();
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-brand-secondary rounded-lg shadow-xl p-6 md:p-8 w-full max-w-lg animate-scale-in">
                <h3 className="text-xl md:text-2xl font-bold mb-4">Generate Blog Post with VÓID AI</h3>
                <p className="text-brand-text-secondary mb-6">Enter a topic and let our AI generate a draft for you.</p>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., 'The Impact of Quantum Computing'"
                        className="w-full bg-brand-dark border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} disabled={isLoading} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 active:scale-95">
                        Cancel
                    </button>
                    <button onClick={handleGenerate} disabled={isLoading} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center disabled:opacity-50 active:scale-95">
                        {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PostModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onSubmit: (post: BlogPost) => void;
    post?: BlogPost | null; 
}> = ({ isOpen, onClose, onSubmit, post }) => {
    const isEditMode = !!post;
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

     const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!title.trim()) newErrors.title = 'Post title is required.';
        if (!author.trim()) newErrors.author = 'Author name is required.';
        if (imagePreviews.length > 5) newErrors.images = "You can upload a maximum of 5 images.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (isOpen) {
            validate();
        }
    }, [title, author, imagePreviews, isOpen]);

     useEffect(() => {
        if (isEditMode && post) {
            setTitle(post.title);
            setAuthor(post.author);
            setImagePreviews(post.imageUrls);
        } else {
            setTitle('');
            setAuthor('');
            setImagePreviews([]);
        }
        setTouched({});
        setErrors({});
    }, [post, isEditMode, isOpen]);
    
     const handleBlur = (field: string) => {
        setTouched(prev => ({...prev, [field]: true}));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
             if (files.length + imagePreviews.length > 5) {
                setErrors(prev => ({ ...prev, images: "You can upload a maximum of 5 images."}));
                return;
            }
            const base64Promises = files.map(fileToBase64);
            const newPreviews = await Promise.all(base64Promises);
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };
    
    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({title: true, author: true});
        if (!validate()) {
            return;
        }
        
        const submittedPost: BlogPost = {
            id: isEditMode ? post.id : `b${Date.now()}`,
            title,
            author,
            imageUrls: imagePreviews,
            date: isEditMode ? post.date : new Date().toISOString().split('T')[0],
            status: isEditMode ? post.status : 'Draft',
            traffic: isEditMode ? post.traffic : 0,
        };

        onSubmit(submittedPost);
        onClose();
    };

    if (!isOpen) return null;
    
    const isFormValid = Object.keys(errors).length === 0;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-xl p-6 md:p-8 w-full max-w-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl md:text-2xl font-bold mb-6">{isEditMode ? 'Edit Post' : 'Create New Post'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input type="text" placeholder="Post Title" value={title} onChange={e => setTitle(e.target.value)} onBlur={() => handleBlur('title')} className={`w-full bg-brand-dark rounded-lg py-2 px-4 focus:outline-none focus:ring-2 transition-colors ${touched.title && errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-brand-accent'}`} />
                        {touched.title && errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <input type="text" placeholder="Author Name" value={author} onChange={e => setAuthor(e.target.value)} onBlur={() => handleBlur('author')} className={`w-full bg-brand-dark rounded-lg py-2 px-4 focus:outline-none focus:ring-2 transition-colors ${touched.author && errors.author ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-brand-accent'}`} />
                        {touched.author && errors.author && <p className="text-red-400 text-xs mt-1">{errors.author}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Post Images (up to 5, first is cover)</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-brand-accent-hover"/>
                        {errors.images && <p className="text-red-400 text-xs mt-1">{errors.images}</p>}
                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
                            {imagePreviews.map((src, index) => (
                                <div key={index} className="relative group">
                                    <img src={src} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded-md" />
                                    <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-600/80 text-white rounded-full p-0.5 m-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95">Cancel</button>
                        <button type="submit" disabled={!isFormValid} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">{isEditMode ? 'Update Post' : 'Create Post'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const WordsControl: React.FC = () => {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const [posts, setPosts] = useState<BlogPost[]>(MOCK_POSTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<BlogPost['status'] | 'All'>('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof BlogPost | null; direction: 'ascending' | 'descending' }>({ key: 'date', direction: 'descending' });
    const [postToEdit, setPostToEdit] = useState<BlogPost | null>(null);
    const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setPosts(prevPosts =>
                prevPosts.map(post => {
                    let newPost = { ...post };
                    if (newPost.status === 'Published') {
                        newPost.traffic += Math.floor(Math.random() * 25);
                    } else if (newPost.status === 'Draft' && Math.random() > 0.95) {
                        newPost.status = 'Published';
                        newPost.date = new Date().toISOString().split('T')[0];
                    }
                    return newPost;
                })
            );
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const handleAddPost = (newPost: BlogPost) => {
        setPosts(prev => [newPost, ...prev]);
    };
    
    const handleUpdatePost = (updatedPost: BlogPost) => {
        setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    };
    
    const handleDeletePost = () => {
        if (!postToDelete) return;
        setPosts(prev => prev.filter(p => p.id !== postToDelete.id));
        setPostToDelete(null);
    };

    const handleOpenEditModal = (post: BlogPost) => {
        setPostToEdit(post);
        setIsPostModalOpen(true);
    };
    
    const handleOpenAddModal = () => {
        setPostToEdit(null);
        setIsPostModalOpen(true);
    };

    const handleClosePostModal = () => {
        setIsPostModalOpen(false);
        setPostToEdit(null);
    };

    const filteredAndSortedPosts = useMemo(() => {
        let sortableItems = [...posts];

        // Filtering
        sortableItems = sortableItems.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === 'All' || post.status === statusFilter)
        );

        // Sorting
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const key = sortConfig.key as keyof Omit<BlogPost, 'imageUrls'>;
                const valA = a[key];
                const valB = b[key];
                
                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableItems;
    }, [posts, searchTerm, statusFilter, sortConfig]);

    const requestSort = (key: keyof BlogPost) => {
        if (key === 'imageUrls') return;
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-6">
            {isAiModalOpen && <AiModal onClose={() => setIsAiModalOpen(false)} setGeneratedContent={setGeneratedContent}/>}
            <PostModal 
                isOpen={isPostModalOpen} 
                onClose={handleClosePostModal}
                onSubmit={postToEdit ? handleUpdatePost : handleAddPost} 
                post={postToEdit}
            />
            <ConfirmationModal
                isOpen={!!postToDelete}
                onClose={() => setPostToDelete(null)}
                onConfirm={handleDeletePost}
                title="Delete Post"
                message={<>Are you sure you want to delete the post "<strong>{postToDelete?.title}</strong>"?</>}
                confirmButtonText="Delete"
            />

            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <h2 className="text-2xl font-bold">WORD'S Content Management</h2>
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 self-start md:self-auto w-full sm:w-auto">
                     <button onClick={() => setIsAiModalOpen(true)} className="bg-transparent border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95">
                        Generate with VÓID AI
                    </button>
                    <button onClick={handleOpenAddModal} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95">
                        Create New Post
                    </button>
                </div>
            </div>

            <div className="bg-brand-secondary p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-brand-dark border border-gray-700 rounded-lg py-2 px-4 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as BlogPost['status'] | 'All')}
                    className="bg-brand-dark border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent w-full md:w-auto"
                >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                </select>
            </div>

            {generatedContent && (
                <div className="bg-brand-secondary rounded-lg shadow-lg p-6 animate-fade-in-up">
                    <h3 className="text-xl font-bold mb-4">AI Generated Draft</h3>
                    <div className="prose prose-sm md:prose-base prose-invert max-w-none bg-brand-dark p-4 rounded-md border border-gray-700" dangerouslySetInnerHTML={{ __html: generatedContent }} />
                </div>
            )}

            <div className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-brand-text-secondary whitespace-nowrap">
                        <thead className="text-xs text-brand-text uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('title')}>
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('author')}>
                                    Author
                                </th>
                                <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('date')}>
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('traffic')}>
                                    Traffic (Views)
                                </th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedPosts.map((post, index) => (
                                 <tr key={post.id} className="bg-brand-secondary border-b border-gray-700 hover:bg-gray-700/50 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}>
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-normal flex items-center">
                                    {post.imageUrls && post.imageUrls.length > 0 && <img src={post.imageUrls[0]} alt={post.title} className="w-16 h-10 object-cover rounded-md mr-4"/>}
                                    {post.title}
                                    </th>
                                    <td className="px-6 py-4">{post.author}</td>
                                    <td className="px-6 py-4">{post.date}</td>
                                    <td className="px-6 py-4">{post.traffic.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button onClick={() => handleOpenEditModal(post)} className="font-medium text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Edit</button>
                                        <button onClick={() => setPostToDelete(post)} className="font-medium text-red-500 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">Delete</button>
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

export default WordsControl;