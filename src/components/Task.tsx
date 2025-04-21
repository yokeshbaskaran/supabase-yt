import { useEffect, useState } from "react";
import { supabaseClient } from "../supabase/client";
import { Session } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";

interface Task {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

const Task = ({ session }: { session: Session }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskImg, setTaskImg] = useState<File | null>(null);

  const fetchPosts = async () => {
    const { error, data } = await supabaseClient
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.log("Error addingTask:", error);
      return;
    }

    setTasks(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${file.name}-${Date.now()}`;
    const compressFile = await imageCompression(file, { maxSizeMB: 1 });

    const { error } = await supabaseClient.storage
      .from("tasks-image")
      .upload(filePath, compressFile);

    if (error) {
      console.log("Error uploadImage:", error);
      return null;
    }

    const { data } = supabaseClient.storage
      .from("tasks-image")
      .getPublicUrl(filePath);

    const fileUrl = data.publicUrl;
    // console.log("file-url", fileUrl);

    return fileUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl: string | null = null;
    if (taskImg) {
      imageUrl = await uploadImage(taskImg);
      // console.log("image:", imageUrl);
    }

    const { error } = await supabaseClient
      .from("tasks")
      .insert({ ...newTask, email: session.user.email, image_url: imageUrl })
      .single();

    if (error) {
      console.log("Error addingTask:", error);
      return;
    }
    setNewTask({ title: "", description: "" });
    alert("task is added");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFile = e.target.files[0];
      setTaskImg(imageFile);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Task Manager - CRUD </h2>

        <input
          className="input-box"
          type="text"
          placeholder="title"
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <br />
        <input
          className="input-box"
          type="text"
          placeholder="Descriptiom"
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, description: e.target.value }))
          }
        />

        <input
          className="input-box"
          type="file"
          accept="image/*"
          placeholder="Descriptiom"
          onChange={handleFileChange}
        />

        <br />
        <br />
        <button className="add-btn">Add</button>
      </form>

      {/* List of tasks  */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task, key) => (
          <li
            key={key}
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              {task?.image_url && (
                <img src={task.image_url} style={{ height: 70 }} />
              )}

              <div>
                <textarea
                  placeholder="Updated description..."
                  // onChange={(e) => setNewDescription(e.target.value)}
                />
                <button
                  style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
                  // onClick={() => updateTask(task.id)}
                >
                  Edit
                </button>
                <button
                  style={{ padding: "0.5rem 1rem" }}
                  // onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Task;
