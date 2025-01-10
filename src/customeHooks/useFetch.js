import { useState , useEffect} from "react";
import axios from "axios";

function useFetch (query, page, genre,year){
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const fetchData = async () =>{
            if(!query) { query = "popular"};

            setLoading(true);
            setError(null);
            try{
                const response = await axios.get(`http://localhost:3001/api/movies`,{
                    params: {
                      query,
                      page,
                      genre,
                      year,
                    },
                  });
              
                if(page == 1){
                    setData(response.data.results);
                }else{
                    setData((prev) => [...prev, ...response.data.results])
                }
            }
            catch(error){
                setError(error.message);
            }
            setLoading(false);
        }
         fetchData();
    },[query, page, genre, year])

    return {data, error, loading}
}

export default useFetch;