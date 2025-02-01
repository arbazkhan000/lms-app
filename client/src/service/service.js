import axios from "axios";

class ApiService {
    static async getAllCourse() {
        const url = "http://localhost:7777/api/v1/allcourse";
        const response = await axios.get(url);
        return response.data;
    }
}


export default ApiService;