async function fetchData() {
    const response = await fetch("http://localhost:5000/todos", {
        method:"GET"
    });
    return response.json();
}

async function postData(newToDo) {
    const response = await fetch("http://localhost:5000/todos", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newToDo)
    });
    return response.json();
}

const Page = async () => {
    const data = await fetchData();
    console.log(data);

    const toDoExample = {
        id: "4",
        title: "Task 4",
        completed: false
    };

    // const postRes = await postData(toDoExample);
    // console.log(postRes);

    return (
        <div>
            <h1>fetch</h1>
        </div>
    );
    //<h1>${data}</h1>

}

export default Page