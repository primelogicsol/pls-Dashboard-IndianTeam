import { FreelancersData } from '@/types/freelancers'
import axios from 'axios'
import { apiInstance } from './axiosInstance'

// Get all FreeLancers Request
export async function getAllFreelancersRequest() {
	try {
		const response = await apiInstance.get<FreelancersData>(
			'/freelancer/getAllFreeLancerRequestV2'
		)
		console.log('data', response.data)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error:', error.response?.data || error.message)
			throw new Error(
				error.response?.data?.message || 'Failed to fetch projects'
			)
		} else {
			console.error('Unexpected error:', error)
			throw new Error('An unexpected error occurred')
		}
	}
}

// Get all FreeLancers
// export async function getAllFreelancers() {
//   try {
//     const response = await apiInstance.get("/freelancer/listAllFreelancers");
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Axios error:", error.response?.data || error.message);
//       throw new Error(
//         error.response?.data?.message || "Failed to fetch projects"
//       );
//     } else {
//       console.error("Unexpected error:", error);
//       throw new Error("An unexpected error occurred");
//     }
//   }
// }
export async function getAllFreelancers(page: number) {
	try {
		const response = await apiInstance.get('/freelancer/listAllFreelancersV2', {
			params: {
				page: page,
				// limit:limit // Include only if a rank is selected
			},
		})

		return response.data // Response contains freelancers & pagination metadata
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error:', error.response?.data || error.message)
			throw new Error(
				error.response?.data?.message || 'Failed to fetch freelancers'
			)
		} else {
			console.error('Unexpected error:', error)
			throw new Error('An unexpected error occurred')
		}
	}
}

// Get all FreeLancers
export async function getAllTrashedFreelancers() {
	try {
		const response = await apiInstance.get('/freelancer/listAllFreelancersV2')
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error:', error.response?.data || error.message)
			throw new Error(
				error.response?.data?.message || 'Failed to fetch projects'
			)
		} else {
			console.error('Unexpected error:', error)
			throw new Error('An unexpected error occurred')
		}
	}
}
// Accept FreeLancers
export async function AcceptFreeLancerRequests(id: string) {
	try {
		const response = await apiInstance.patch(
			`/freelancer/acceptFreeLancerRequestV2/${id}`
		)
		return response
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error:', error.response?.data || error.message)
			throw new Error(
				error.response?.data?.message || 'Failed to fetch projects'
			)
		} else {
			console.error('Unexpected error:', error)
			throw new Error('An unexpected error occurred')
		}
	}
}

//Trash a freelancer
export async function TrashAFreeLancer(id: number) {
	try {
		const response = await apiInstance.patch(
			`/freelancer/trashFreeLancerRequestV2/${id}`
		)
		return response
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Axios error:', error.response?.data || error.message)
			throw new Error(
				error.response?.data?.message || 'Failed to Trash the freelancer'
			)
		} else {
			console.error('Unexpected error:', error)
			throw new Error('An unexpected error occurred')
		}
	}
}
