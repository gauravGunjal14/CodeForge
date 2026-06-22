import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { Plus, Trash2, Code2, FileText, Eye, EyeOff, Save, Sparkles } from "lucide-react";

const problemSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    description: z.string().min(3, 'Description is required'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    tags: z.enum(['Array', 'Linked List', 'Graph', 'Dynamic Programming']),
    visibleTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required'),
            explanation: z.string().min(1, 'Explanation is required')
        })
    ).min(1, 'At least one visible test case required'),
    hiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required')
        })
    ).min(1, 'At least one hidden test case required'),
    startCode: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            initialCode: z.string().min(1, 'Initial code is required')
        })
    ).length(3, 'All three languages required'),
    referenceSolution: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            completeCode: z.string().min(1, 'Complete code is required')
        })
    ).length(3, 'All three languages required')
});

function CreateProblem() {
    const navigate = useNavigate();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            startCode: [
                { language: 'C++', initialCode: '' },
                { language: 'Java', initialCode: '' },
                { language: 'JavaScript', initialCode: '' }
            ],
            referenceSolution: [
                { language: 'C++', completeCode: '' },
                { language: 'Java', completeCode: '' },
                { language: 'JavaScript', completeCode: '' }
            ]
        }
    });

    const {
        fields: visibleFields,
        append: appendVisible,
        remove: removeVisible
    } = useFieldArray({
        control,
        name: 'visibleTestCases'
    });

    const {
        fields: hiddenFields,
        append: appendHidden,
        remove: removeHidden
    } = useFieldArray({
        control,
        name: 'hiddenTestCases'
    });

    const onSubmit = async (data) => {
        try {
            await axiosClient.post('/problem/create', data);
            alert('Problem created successfully!');
            navigate('/');
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-primary" />
                            Create New Problem
                        </h1>

                        <p className="text-base-content/60 mt-2">
                            Add coding challenges, test cases and reference solutions.
                        </p>
                    </div>

                    <div className="badge badge-primary badge-lg">
                        Admin Panel
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="card bg-base-100 border border-base-300 shadow-xl">
                        <div className="card-body">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <FileText className="w-6 h-6 text-primary" />
                                Basic Information
                            </h2>
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Title</span>
                                    </label>
                                    <input
                                        {...register('title')}
                                        placeholder="Example: Two Sum"
                                        className={`input input-bordered w-full ${errors.title ? 'input-error' : ''
                                            }`}
                                    />
                                    {errors.title && (
                                        <span className="text-error">{errors.title.message}</span>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Description</span>
                                    </label>
                                    <textarea
                                        {...register('description')}
                                        placeholder="Write complete problem description..."
                                        className={`textarea textarea-bordered h-40 ${errors.description ? 'textarea-error' : ''
                                            }`}
                                    />
                                    {errors.description && (
                                        <span className="text-error">{errors.description.message}</span>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <div className="form-control w-1/2">
                                        <label className="label">
                                            <span className="label-text">Difficulty</span>
                                        </label>
                                        <select
                                            {...register('difficulty')}
                                            className={`select select-bordered ${errors.difficulty && 'select-error'}`}
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>

                                    <div className="form-control w-1/2">
                                        <label className="label">
                                            <span className="label-text">Tag</span>
                                        </label>
                                        <select
                                            {...register('tags')}
                                            className={`select select-bordered ${errors.tags && 'select-error'}`}
                                        >
                                            <option value="Array">Array</option>
                                            <option value="Linked List">Linked List</option>
                                            <option value="Graph">Graph</option>
                                            <option value="Dynamic Programming">DP</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Test Cases */}
                        <div className="card bg-base-100 shadow-lg p-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Eye className="w-6 h-6 text-success" />
                                Test Cases
                            </h2>

                            {/* Visible Test Cases */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium">Visible Test Cases</h3>
                                    <button
                                        type="button"
                                        onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                                        className="btn btn-sm btn-primary"
                                    >
                                        Add Visible Case
                                    </button>
                                </div>

                                {visibleFields.map((field, index) => (
                                    <div key={field.id} className="border p-4 rounded-lg space-y-2">
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeVisible(index)}
                                                className="btn btn-xs btn-error"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <input
                                            {...register(`visibleTestCases.${index}.input`)}
                                            placeholder="Input"
                                            className="input input-bordered w-full"
                                        />

                                        <input
                                            {...register(`visibleTestCases.${index}.output`)}
                                            placeholder="Output"
                                            className="input input-bordered w-full"
                                        />

                                        <textarea
                                            {...register(`visibleTestCases.${index}.explanation`)}
                                            placeholder="Explanation"
                                            className="textarea textarea-bordered w-full"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Hidden Test Cases */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <EyeOff className="w-5 h-5 text-warning" />
                                        Hidden Test Cases
                                    </h3>
                                    <p className="text-sm opacity-70">
                                        Used during final submission validation
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => appendHidden({ input: '', output: '' })}
                                        className="btn btn-sm btn-primary"
                                    >
                                        Add Hidden Case
                                    </button>
                                </div>

                                {hiddenFields.map((field, index) => (
                                    <div key={field.id} className="border p-4 rounded-lg space-y-2">
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeHidden(index)}
                                                className="btn btn-xs btn-error"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <input
                                            {...register(`hiddenTestCases.${index}.input`)}
                                            placeholder="Input"
                                            className="input input-bordered w-full"
                                        />

                                        <input
                                            {...register(`hiddenTestCases.${index}.output`)}
                                            placeholder="Output"
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Code Templates */}
                        <div className="card bg-base-100 shadow-lg p-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Code2 className="w-6 h-6 text-primary" />
                                Code Templates
                            </h2>

                            <div className="space-y-6">
                                {[0, 1, 2].map((index) => (
                                    <div className="bg-base-200 rounded-xl px-4 py-3">
                                        <h3 className="font-bold text-lg">
                                            {index === 0
                                                ? 'C++'
                                                : index === 1
                                                    ? 'Java'
                                                    : 'JavaScript'}
                                        </h3>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Initial Code</span>
                                            </label>
                                            <pre className="bg-base-300 p-4 rounded-lg">
                                                <textarea
                                                    {...register(`startCode.${index}.initialCode`)}
                                                    rows={10}
                                                    className="textarea textarea-bordered font-mono w-full"
                                                />
                                            </pre>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Reference Solution</span>
                                            </label>
                                            <pre className="bg-base-300 p-4 rounded-lg">
                                                <textarea
                                                    {...register(`referenceSolution.${index}.completeCode`)}
                                                    rows={10}
                                                    className="textarea textarea-bordered font-mono w-full"
                                                />
                                            </pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sticky bottom-6 z-50">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-full shadow-2xl"
                            >
                                <Save className="w-5 h-5" />
                                Create Problem
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateProblem;