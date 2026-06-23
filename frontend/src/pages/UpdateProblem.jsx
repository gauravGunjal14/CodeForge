import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import ProblemForm from '../components/ProblemForm';

function UpdateProblem() {

    const { problemId } = useParams();

    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProblem();
    }, []);

    const fetchProblem = async () => {
        try {
            setLoading(true);

            const { data } = await axiosClient.get(
                `/problem/getProblem/${problemId}`
            );

            setProblem(data);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    const updateProblem = async (formData) => {
        try {

            await axiosClient.put(
                `/problem/update/${problemId}`,
                formData
            );

            alert('Problem Updated Successfully');

            navigate('/admin/problems');
        }
        catch (error) {
            alert(
                error.response?.data?.message ||
                error.message
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <ProblemForm
            mode="update"
            initialData={problem}
            onSubmit={updateProblem}
        />
    );
}

export default UpdateProblem;