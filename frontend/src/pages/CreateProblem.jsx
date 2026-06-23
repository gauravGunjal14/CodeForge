import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import ProblemForm from '../components/ProblemForm';

function CreateProblem() {
    const navigate = useNavigate();

    const createProblem = async (data) => {
        try {
            await axiosClient.post('/problem/create', data);

            alert('Problem created successfully!');
            navigate('/');
        }
        catch (error) {
            alert(
                error.response?.data?.message ||
                error.message
            );
        }
    };

    return (
        <ProblemForm
            mode="create"
            onSubmit={createProblem}
        />
    );
}

export default CreateProblem;