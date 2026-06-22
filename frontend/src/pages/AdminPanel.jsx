// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import axiosClient from '../utils/axiosClient';
// import { useNavigate } from 'react-router';

// const problemSchema = z.object({
//     title: z.string().min(3, 'Title is required'),
//     description: z.string().min(3, 'Description is required'),
//     difficulty: z.enum(['Easy', 'Medium', 'Hard']),
//     tags: z.enum(['Array', 'Linked List', 'Graph', 'Dynamic Programming']),
//     visibleTestCases: z.array(
//         z.object({
//             input: z.string().min(1, 'Input is required'),
//             output: z.string().min(1, 'Output is required'),
//             explanation: z.string().min(1, 'Explanation is required')
//         })
//     ).min(1, 'At least one visible test case required'),
//     hiddenTestCases: z.array(
//         z.object({
//             input: z.string().min(1, 'Input is required'),
//             output: z.string().min(1, 'Output is required')
//         })
//     ).min(1, 'At least one hidden test case required'),
//     startCode: z.array(
//         z.object({
//             language: z.enum(['C++', 'Java', 'JavaScript']),
//             initialCode: z.string().min(1, 'Initial code is required')
//         })
//     ).length(3, 'All three languages required'),
//     referenceSolution: z.array(
//         z.object({
//             language: z.enum(['C++', 'Java', 'JavaScript']),
//             completeCode: z.string().min(1, 'Complete code is required')
//         })
//     ).length(3, 'All three languages required')
// });

// function AdminPanel() {
//     const navigate = useNavigate();
//     const {
//         register,
//         control,
//         handleSubmit,
//         formState: { errors }
//     } = useForm({
//         resolver: zodResolver(problemSchema),
//         defaultValues: {
//             startCode: [
//                 { language: 'C++', initialCode: '' },
//                 { language: 'Java', initialCode: '' },
//                 { language: 'JavaScript', initialCode: '' }
//             ],
//             referenceSolution: [
//                 { language: 'C++', completeCode: '' },
//                 { language: 'Java', completeCode: '' },
//                 { language: 'JavaScript', completeCode: '' }
//             ]
//         }
//     });

//     const {
//         fields: visibleFields,
//         append: appendVisible,
//         remove: removeVisible
//     } = useFieldArray({
//         control,
//         name: 'visibleTestCases'
//     });

//     const {
//         fields: hiddenFields,
//         append: appendHidden,
//         remove: removeHidden
//     } = useFieldArray({
//         control,
//         name: 'hiddenTestCases'
//     });

//     const onSubmit = async (data) => {
//         try {
//             await axiosClient.post('/problem/create', data);
//             alert('Problem created successfully!');
//             navigate('/');
//         } catch (error) {
//             alert(`Error: ${error.response?.data?.message || error.message}`);
//         }
//     };

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 {/* Basic Information */}
//                 <div className="card bg-base-100 shadow-lg p-6">
//                     <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
//                     <div className="space-y-4">
//                         <div className="form-control">
//                             <label className="label">
//                                 <span className="label-text">Title</span>
//                             </label>
//                             <input
//                                 {...register('title')}
//                                 className={`input input-bordered ${errors.title && 'input-error'}`}
//                             />
//                             {errors.title && (
//                                 <span className="text-error">{errors.title.message}</span>
//                             )}
//                         </div>

//                         <div className="form-control">
//                             <label className="label">
//                                 <span className="label-text">Description</span>
//                             </label>
//                             <textarea
//                                 {...register('description')}
//                                 className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`}
//                             />
//                             {errors.description && (
//                                 <span className="text-error">{errors.description.message}</span>
//                             )}
//                         </div>

//                         <div className="flex gap-4">
//                             <div className="form-control w-1/2">
//                                 <label className="label">
//                                     <span className="label-text">Difficulty</span>
//                                 </label>
//                                 <select
//                                     {...register('difficulty')}
//                                     className={`select select-bordered ${errors.difficulty && 'select-error'}`}
//                                 >
//                                     <option value="Easy">Easy</option>
//                                     <option value="Medium">Medium</option>
//                                     <option value="Hard">Hard</option>
//                                 </select>
//                             </div>

//                             <div className="form-control w-1/2">
//                                 <label className="label">
//                                     <span className="label-text">Tag</span>
//                                 </label>
//                                 <select
//                                     {...register('tags')}
//                                     className={`select select-bordered ${errors.tags && 'select-error'}`}
//                                 >
//                                     <option value="Array">Array</option>
//                                     <option value="Linked List">Linked List</option>
//                                     <option value="Graph">Graph</option>
//                                     <option value="Dynamic Programming">DP</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Test Cases */}
//                 <div className="card bg-base-100 shadow-lg p-6">
//                     <h2 className="text-xl font-semibold mb-4">Test Cases</h2>

//                     {/* Visible Test Cases */}
//                     <div className="space-y-4 mb-6">
//                         <div className="flex justify-between items-center">
//                             <h3 className="font-medium">Visible Test Cases</h3>
//                             <button
//                                 type="button"
//                                 onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
//                                 className="btn btn-sm btn-primary"
//                             >
//                                 Add Visible Case
//                             </button>
//                         </div>

//                         {visibleFields.map((field, index) => (
//                             <div key={field.id} className="border p-4 rounded-lg space-y-2">
//                                 <div className="flex justify-end">
//                                     <button
//                                         type="button"
//                                         onClick={() => removeVisible(index)}
//                                         className="btn btn-xs btn-error"
//                                     >
//                                         Remove
//                                     </button>
//                                 </div>

//                                 <input
//                                     {...register(`visibleTestCases.${index}.input`)}
//                                     placeholder="Input"
//                                     className="input input-bordered w-full"
//                                 />

//                                 <input
//                                     {...register(`visibleTestCases.${index}.output`)}
//                                     placeholder="Output"
//                                     className="input input-bordered w-full"
//                                 />

//                                 <textarea
//                                     {...register(`visibleTestCases.${index}.explanation`)}
//                                     placeholder="Explanation"
//                                     className="textarea textarea-bordered w-full"
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     {/* Hidden Test Cases */}
//                     <div className="space-y-4">
//                         <div className="flex justify-between items-center">
//                             <h3 className="font-medium">Hidden Test Cases</h3>
//                             <button
//                                 type="button"
//                                 onClick={() => appendHidden({ input: '', output: '' })}
//                                 className="btn btn-sm btn-primary"
//                             >
//                                 Add Hidden Case
//                             </button>
//                         </div>

//                         {hiddenFields.map((field, index) => (
//                             <div key={field.id} className="border p-4 rounded-lg space-y-2">
//                                 <div className="flex justify-end">
//                                     <button
//                                         type="button"
//                                         onClick={() => removeHidden(index)}
//                                         className="btn btn-xs btn-error"
//                                     >
//                                         Remove
//                                     </button>
//                                 </div>

//                                 <input
//                                     {...register(`hiddenTestCases.${index}.input`)}
//                                     placeholder="Input"
//                                     className="input input-bordered w-full"
//                                 />

//                                 <input
//                                     {...register(`hiddenTestCases.${index}.output`)}
//                                     placeholder="Output"
//                                     className="input input-bordered w-full"
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Code Templates */}
//                 <div className="card bg-base-100 shadow-lg p-6">
//                     <h2 className="text-xl font-semibold mb-4">Code Templates</h2>

//                     <div className="space-y-6">
//                         {[0, 1, 2].map((index) => (
//                             <div key={index} className="space-y-2">
//                                 <h3 className="font-medium">
//                                     {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
//                                 </h3>

//                                 <div className="form-control">
//                                     <label className="label">
//                                         <span className="label-text">Initial Code</span>
//                                     </label>
//                                     <pre className="bg-base-300 p-4 rounded-lg">
//                                         <textarea
//                                             {...register(`startCode.${index}.initialCode`)}
//                                             className="w-full bg-transparent font-mono"
//                                             rows={6}
//                                         />
//                                     </pre>
//                                 </div>

//                                 <div className="form-control">
//                                     <label className="label">
//                                         <span className="label-text">Reference Solution</span>
//                                     </label>
//                                     <pre className="bg-base-300 p-4 rounded-lg">
//                                         <textarea
//                                             {...register(`referenceSolution.${index}.completeCode`)}
//                                             className="w-full bg-transparent font-mono"
//                                             rows={6}
//                                         />
//                                     </pre>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <button type="submit" className="btn btn-primary w-full">
//                     Create Problem
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default AdminPanel;


import { useNavigate } from "react-router-dom";
import {
    PlusCircle,
    PencilLine,
    Trash2,
    ShieldCheck
} from "lucide-react";

function AdminPanel() {
    const navigate = useNavigate();

    const cards = [
        {
            title: "Create Problem",
            description: "Add a new coding problem with test cases and solutions.",
            icon: PlusCircle,
            path: "/admin/create",
            color: "text-success",
            bg: "bg-success/10"
        },
        {
            title: "Update Problem",
            description: "Modify existing problems, examples and solutions.",
            icon: PencilLine,
            path: "/admin/update",
            color: "text-warning",
            bg: "bg-warning/10"
        },
        {
            title: "Delete Problem",
            description: "Remove unwanted or outdated problems.",
            icon: Trash2,
            path: "/admin/delete",
            color: "text-error",
            bg: "bg-error/10"
        }
    ];

    return (
        <div className="min-h-screen bg-base-200">

            {/* Header */}
            <div className="border-b bg-base-100">
                <div className="max-w-7xl mx-auto px-8 py-6 flex items-center gap-4">

                    <div className="p-3 rounded-2xl bg-primary/10">
                        <ShieldCheck size={32} className="text-primary" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold">
                            Admin Dashboard
                        </h1>

                        <p className="text-base-content/60">
                            Manage problems, test cases and platform content.
                        </p>
                    </div>

                </div>
            </div>

            {/* Cards */}
            <div className="max-w-7xl mx-auto px-8 py-10">

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                onClick={() => navigate(card.path)}
                                className="group cursor-pointer bg-base-100 rounded-3xl p-7 border border-base-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >

                                <div
                                    className={`w-16 h-16 rounded-2xl ${card.bg} flex items-center justify-center mb-5`}
                                >
                                    <Icon
                                        size={32}
                                        className={`${card.color}`}
                                    />
                                </div>

                                <h2 className="text-2xl font-bold mb-3">
                                    {card.title}
                                </h2>

                                <p className="text-base-content/60 mb-6">
                                    {card.description}
                                </p>

                                <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-all">
                                    Open →
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;