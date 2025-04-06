const supabase = require("../../../supabase-admin");

class EmployeeService {
    async getEmployees() {
        const {data, error} = await supabase.auth.admin.listUsers();
        if (error) {
            throw new Error(error.message);
        }

        return data.users;
    }

    async getEmployee(id) {
        const {data, error} = await supabase.auth.admin.getUserById(id);
        if (error) {
            throw new Error(error.message);
        }
        return data.user;
    }

    async createEmployee(data) {
        const {email, password, name, role} = data;
        if (!email || !password || !name) {
            throw new Error("Name, email, and password are required");
        }

        const {data: createData, error} = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                name,
                role
            }
        });
        if (error) {
            throw new Error(error.message);
        }
        return createData.user;
    }

    async updateEmployee(id, data) {
        const updatePayload = {user_metadata: {}};
        if (data.email) updatePayload.email = data.email;
        if (data.password) updatePayload.password = data.password;
        if (data.name) updatePayload.user_metadata.name = data.name;
        if (data.role) updatePayload.role = data.role;

        const {data: updateData, error} = await supabase.auth.admin.updateUserById(id, updatePayload);
        if (error) {
            throw new Error(error.message);
        }
        return updateData.user;
    }

    async deleteEmployee(id) {
        const {error } = await supabase.auth.admin.deleteUser(id);

        if (error) {
            throw new Error(error.message);
        }

        return true;
    }
}

module.exports = new EmployeeService();
