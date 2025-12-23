import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { type JournalEntry } from "./types/journal";



const fetchJournals = async() =>{
    try{
        let {data} = await api.get<JournalEntry []>('/journals');
        return data;
    }
    catch(error){
        console.log(error);
    }
}

export const useJournals =(enabled:boolean)=>{
    return useQuery(
       { 
        queryKey: ['journals'],
        queryFn: fetchJournals,
        enabled,
        
    }
    )
} 