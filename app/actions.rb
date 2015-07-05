# Homepage (Root path)
get '/' do
  erb :index
end


# Contacts, Search results, posting new contacts

get '/contacts' do
  content_type :json
  @contacts = Contact.all.order(first_name: :ASC)
  @contacts.to_json
end

get '/contacts/:id' do
  content_type :json
  Contact.find(params[:id]).to_json
end

post '/contacts' do
  content_type :json

  new_contact = "#{params[:first_name]}"
  return false if /.*[<scri].*/.match(new_contact)

  new_contact = Contact.new(first_name: params[:first_name], last_name: params[:last_name], phone_number: params[:phone_number], email: params[:email])
  if new_contact.save
    return new_contact.to_json
  else
    new_contact.errors
  end

end

delete '/contacts/:id' do
  Contact.find(params[:id]).destroy
end
