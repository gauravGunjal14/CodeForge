import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { Pencil, Trash2 } from 'lucide-react';
import PageSkeleton from '../components/PageSkeleton';

function ProblemList() {

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const navigate = useNavigate();

    const handleDelete = async (problemId) => {
        try {

            await axiosClient.delete(
                `/problem/delete/${problemId}`
            );

            setProblems((prev) =>
                prev.filter(
                    (problem) => problem._id !== problemId
                )
            );

            document
                .getElementById('delete_modal')
                .close();

        }
        catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);

            const { data } = await axiosClient.get(
                '/problem/getall'
            );

            setProblems(data);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <PageSkeleton />;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-4xl font-bold mb-8">
                Update Problems
            </h1>

            <div className="space-y-4">

                {problems.map((problem) => (

                    <div
                        key={problem._id}
                        className="card bg-base-100 border shadow"
                    >
                        <div className="card-body flex-row justify-between items-center">

                            <div>
                                <h2 className="text-xl font-bold">
                                    {problem.title}
                                </h2>

                                <div className="flex gap-2 mt-2">
                                    <div className="badge">
                                        {problem.difficulty}
                                    </div>

                                    <div className="badge badge-outline">
                                        {problem.tags}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/admin/update/${problem._id}`
                                        )
                                    }
                                    className="btn btn-primary btn-sm"
                                >
                                    <Pencil size={16} />
                                    Edit
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedProblem(problem);
                                        document
                                            .getElementById('delete_modal')
                                            .showModal();
                                    }}
                                    className="btn btn-primary btn-sm"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>

                            </div>

                        </div>
                    </div>

                ))}

            </div>

            <dialog
                id="delete_modal"
                className="modal"
            >
                <div className="modal-box">

                    <h3 className="font-bold text-lg text-error">
                        Delete Problem
                    </h3>

                    <p className="py-4">
                        Are you sure you want to delete
                        <span className="font-semibold">
                            {" "}
                            {selectedProblem?.title}
                        </span>
                        ?
                    </p>

                    <div className="modal-action">

                        <form method="dialog">
                            <button className="btn">
                                Cancel
                            </button>
                        </form>

                        <button
                            className="btn btn-error"
                            onClick={() =>
                                handleDelete(
                                    selectedProblem._id
                                )
                            }
                        >
                            Delete
                        </button>

                    </div>

                </div>
            </dialog>

        </div>
    );
}

export default ProblemList;