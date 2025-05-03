import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a3e635'];

const VoteResult = ({ results }) => {
    if (!results || results.length === 0) {
        return <p className="text-center text-gray-600">No votes recorded yet.</p>;
    }

    const data = results.map(option => ({
        name: option.text,
        value: option.votes
    }));

    const totalVotes = data.reduce((sum, item) => sum + item.value, 0);
    if (totalVotes === 0) {
        return <p className="text-center text-gray-600">No votes have been cast yet.</p>;
    }

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default VoteResult;