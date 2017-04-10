package dynamic.proxy;

public class UserServiceImpl implements UserService{
   private int name =1;
	@Override
	public void setName(int name) {
		this.name=name;
	}
	
	@Override
	public int getName() {
		return this.name;
	}

}
